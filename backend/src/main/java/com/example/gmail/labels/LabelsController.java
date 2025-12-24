package com.example.gmail.labels;

import com.example.gmail.labels.dto.LabelDto;
import com.example.gmail.labels.dto.UpsertLabelRequest;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labels")
public class LabelsController {

  private final GmailLabelService service;

  public LabelsController(GmailLabelService service) {
    this.service = service;
  }

  @GetMapping
  public List<LabelDto> list() {
    return service.listLabels();
  }

  @GetMapping("/{id}")
  public LabelDto get(@PathVariable String id) {
    return service.getLabel(id);
 }

  @PostMapping
  public ResponseEntity<LabelDto> create(@Valid @RequestBody UpsertLabelRequest req) {
    return ResponseEntity.ok(service.createLabel(req));
  }

  @PutMapping("/{id}")
  public ResponseEntity<LabelDto> update(@PathVariable String id, @Valid @RequestBody UpsertLabelRequest req) {
    return ResponseEntity.ok(service.updateLabel(id, req));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    service.deleteLabel(id);
    return ResponseEntity.noContent().build();
  }
}