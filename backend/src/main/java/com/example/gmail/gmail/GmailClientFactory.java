package com.example.gmail.gmail;

import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.client.auth.oauth2.Credential;

import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * Builds an authorized Gmail client using:
 * - GOOGLE_CREDENTIALS_PATH: path to OAuth client JSON (downloaded from Google Cloud Console)
 * - GOOGLE_TOKENS_DIR: local folder to store refresh/access tokens (NOT committed)
 *
 * First run will open a browser window to authorize. Subsequent runs will reuse tokens.
 */
@Component
public class GmailClientFactory {

  private static final JacksonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
  private static final List<String> SCOPES = List.of(GmailScopes.GMAIL_LABELS);

  private volatile Gmail cachedClient;

  public Gmail getClient() {
    // Double-checked locking to avoid rebuilding the client multiple times.
    if (cachedClient == null) {
      synchronized (this) {
        if (cachedClient == null) {
          cachedClient = buildAuthorizedGmailClient();
        }
      }
    }
    return cachedClient;
  }

  private Gmail buildAuthorizedGmailClient() {
    try {
      String credentialsPath = requireEnv("GOOGLE_CREDENTIALS_PATH");
      String tokensDir = requireEnv("GOOGLE_TOKENS_DIR");

      Path tokensPath = Path.of(tokensDir);
      Files.createDirectories(tokensPath);

      final NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

      // Load client secrets from the downloaded credentials.json
      GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
          JSON_FACTORY,
          new InputStreamReader(new FileInputStream(credentialsPath))
      );

      GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
          httpTransport,
          JSON_FACTORY,
          clientSecrets,
          SCOPES
      )
          .setDataStoreFactory(new FileDataStoreFactory(tokensPath.toFile()))
          .setAccessType("offline") // ensures refresh token is stored
          .build();

      // Starts a local redirect receiver (http://localhost:xxxx) to finish OAuth
      LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();

      Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

      return new Gmail.Builder(httpTransport, JSON_FACTORY, credential)
          .setApplicationName("gPanel Coding Challenge - Gmail Labels")
          .build();

    } catch (Exception e) {
      throw new RuntimeException("Failed to initialize Gmail client: " + e.getMessage(), e);
    }
  }

  private static String requireEnv(String key) {
    String v = System.getenv(key);
    if (v == null || v.isBlank()) {
      throw new IllegalStateException("Missing required env var: " + key);
    }
    return v;
  }
}