import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UntilDestroy} from '@ngneat/until-destroy';
import {Action, WorkflowService} from "../services/workflow.service";

@UntilDestroy()
@Component({
  selector: 'yeti-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionComponent implements OnInit {

  constructor(
    private actionService: WorkflowService
  ) {
  }

  ngOnInit() {

  }

  onClick(action: Action) {
    this.actionService.emitToWorkflow(action);
  }

  private storageBase64Image: any = "data:image/png;base64,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";

  private bigtableBase64Image = "data:image/png;base64,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";


  isEncrypted(ctrl: Action) {
    return ctrl.encrypted ? "e" : "";
  }

  actions: { item: Action[], title: string }[] = [
    {
      item: [
        {imageId: "storage", name: "File Storage", title: "GCP", encrypted: false, type: "Source", style: this.storageBase64Image},
        {imageId: "bigtable",  name: "Cloud BigTable", title: "GCP", encrypted: false, type: "Source",  style: this.bigtableBase64Image},
        {imageId: "pgp",  name: "PGP File", title: "GCP", encrypted: true, type: "Source",  style: "action-condition"},
      ], title: 'Source'
    },
    {
      item: [
        {imageId: "storage", name: "File", title: "GCP", encrypted: true, type: "Sink",  style: this.storageBase64Image},
        {imageId: "bigtable",  name: "Cloud BigTable", title: "GCP", encrypted: false, type: "Sink",  style: this.bigtableBase64Image},
        {imageId: "pgp",  name: "PGP File", title: "Encrypted", encrypted: true, type: "Sink", style: this.storageBase64Image},
      ], title: 'Sink'
    },
  ];
}