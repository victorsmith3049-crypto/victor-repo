package com.example.gmail.labels;

import com.example.gmail.gmail.GmailClientFactory;
import com.example.gmail.labels.dto.LabelDto;
import com.example.gmail.labels.dto.UpsertLabelRequest;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Label;
import com.google.api.services.gmail.model.ListLabelsResponse;

import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class GmailLabelService {

  private static final String USER_ID = "me"; // Gmail API uses "me" for the authorized user

  private final GmailClientFactory gmailClientFactory;

  public GmailLabelService(GmailClientFactory gmailClientFactory) {
    this.gmailClientFactory = gmailClientFactory;
  }

  public List<LabelDto> listLabels() {
    try {
      Gmail gmail = gmailClientFactory.getClient();
      ListLabelsResponse resp = gmail.users().labels().list(USER_ID).execute();
      List<Label> labels = resp.getLabels() == null ? List.of() : resp.getLabels();

      // The list endpoint returns partial label objects; for a nicer UX you can fetch details per label,
      // but for a coding challenge we keep it light and sort by name.
      return labels.stream()
          .sorted(Comparator.comparing(l -> safe(l.getName())))
          .map(this::toDto)
          .toList();

    } catch (Exception e) {
      throw new RuntimeException("Failed to list labels: " + e.getMessage(), e);
    }
  }

  public LabelDto getLabel(String id) {
    try {
      Gmail gmail = gmailClientFactory.getClient();
      Label label = gmail.users().labels().get(USER_ID, id).execute();
      return toDto(label);
    } catch (Exception e) {
      throw new RuntimeException("Failed to get label: " + e.getMessage(), e);
    }
  }

  public LabelDto createLabel(UpsertLabelRequest req) {
    try {
      Gmail gmail = gmailClientFactory.getClient();

      Label label = new Label()
          .setName(req.name())
          .setLabelListVisibility(req.labelListVisibility())
          .setMessageListVisibility(req.messageListVisibility());

      Label created = gmail.users().labels().create(USER_ID, label).execute();
      return toDto(created);

    } catch (Exception e) {
      throw new RuntimeException("Failed to create label: " + e.getMessage(), e);
    }
  }

  public LabelDto updateLabel(String id, UpsertLabelRequest req) {
    try {
      Gmail gmail = gmailClientFactory.getClient();

      // For safety: block updating system labels (INBOX, SENT, etc.).
      Label existing = gmail.users().labels().get(USER_ID, id).execute();
      if ("system".equalsIgnoreCase(existing.getType())) {
        throw new IllegalArgumentException("Cannot update system label: " + existing.getName());
      }

      Label patch = new Label()
          .setId(id)
          .setName(req.name())
          .setLabelListVisibility(req.labelListVisibility())
          .setMessageListVisibility(req.messageListVisibility());

      Label updated = gmail.users().labels().update(USER_ID, id, patch).execute();
      return toDto(updated);

    } catch (Exception e) {
      throw new RuntimeException("Failed to update label: " + e.getMessage(), e);
    }
  }

  public void deleteLabel(String id) {
    try {
      Gmail gmail = gmailClientFactory.getClient();

      Label existing = gmail.users().labels().get(USER_ID, id).execute();
      if ("system".equalsIgnoreCase(existing.getType())) {
        throw new IllegalArgumentException("Cannot delete system label: " + existing.getName());
      }

      gmail.users().labels().delete(USER_ID, id).execute();

    } catch (Exception e) {
      throw new RuntimeException("Failed to delete label: " + e.getMessage(), e);
    }
  }

  private LabelDto toDto(Label l) {
    return new LabelDto(
        l.getId(),
        l.getName(),
        l.getType(),
        l.getMessagesTotal(),
        l.getMessagesUnread(),
        l.getThreadsTotal(),
        l.getThreadsUnread(),
        l.getLabelListVisibility(),
        l.getMessageListVisibility()
    );
  }

  private static String safe(String s) {
    return s == null ? "" : s;
  }
}