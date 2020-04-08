import {EventEmitter, Injectable} from '@angular/core';

export class Action {
  imageId: string;
  name: string;
  title: string;
  style: string;
  type: string;
  encrypted: boolean;
}


export class WfEdge {
  edgeId: number;
  name?: string;
  wfStepId: number;
  isSelected: boolean;
  linePoints: string;
  arrowPoints: string;
}

export class BeamMData {
  wfStepId: number;
  imageId: string;
  type: string;
  name: string;
  position: { x: number, y: number };
  arrowPoints: string[]
  isSelected: boolean;
  edges?: WfEdge[];

  constructor() {
    this.edges = [];
  }
}

@Injectable({
  providedIn: 'root',
})

export class WorkflowService {

  addWorkflowItem: EventEmitter<Action> = new EventEmitter<Action>();
  private elink: BeamMData;

  constructor() {
  }

  emitToWorkflow(action: Action) {
    this.addWorkflowItem.emit(action);
  }

  getWorkflowEmitter() {
    return this.addWorkflowItem;
  }

  pushSourceEdge(elink: BeamMData) {
    this.elink = elink;
  }

  getSourceEdge(): BeamMData {
    return this.elink;
  }
}
