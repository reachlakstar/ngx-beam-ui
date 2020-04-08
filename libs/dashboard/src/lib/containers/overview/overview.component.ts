import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {LayoutService} from '@yeti/core';
import {BeamMData, WfEdge, WorkflowService} from "../../components/services/workflow.service";
import {NbDialogService} from "@nebular/theme";
import {ConfigsDialogComponent} from "../../components/config/config.component";


@UntilDestroy()
@Component({
  selector: 'yeti-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {

  constructor(private layoutService: LayoutService,
              private workflowService: WorkflowService,
              private dialogService: NbDialogService) {
  }

  workflowItem: any;
  selectedAction: boolean;
  beamWFActions: BeamMData[] = [];

  /** Drag positiions */
  newPosX = 0;
  newPosY = 0;
  initatedDrag: boolean;

  ngOnInit() {
    this.layoutService
      .onChangeLayoutSize()
      .pipe(untilDestroyed(this))
      .subscribe(() => this.resizeChart());

    this.workflowService.getWorkflowEmitter()
      .pipe(untilDestroyed(this))
      .subscribe((item: any) => {
        this.workflowItem = item;
      });
  }

  resizeChart() {
  }

  createWorkflow(event: any) {
    if (this.workflowItem) {
      const beamObject: BeamMData = {
        wfStepId: Date.now(),
        imageId: this.workflowItem.imageId,
        type: this.workflowItem.type,
        name: this.workflowItem.name,
        isSelected: true,
        position: {x: event.layerX, y: event.layerY},
        arrowPoints: this.generateArrowPoints(event.layerX, event.layerY)
      };
      this.deselectAllWorkflowItems();
      this.beamWFActions.push(beamObject);
      this.workflowItem = null;
      console.log(beamObject)
    } else {
      if (!this.selectedAction) {
        this.deselectAllWorkflowItems()
      }
    }
    this.selectedAction = false;
  }

  /**
   * Deselect all workflow items
   * @param x
   * @param y
   */
  deselectAllWorkflowItems() {
    this.beamWFActions.forEach(item => {
      item.isSelected = false;
    })
  }

  openConfigModal(action: BeamMData){
    this.dialogService.open(ConfigsDialogComponent, { context: {
        title: 'This is a title passed to the dialog component',
      }, });
  }
  /**
   * Select the workflow item
   * @param action
   * @param type
   */
  onSelect(action: BeamMData) {
    action.isSelected = true;
    this.doesItemNeedTobeHighlighted(action, "circle");
    this.doesItemNeedTobeHighlighted(action, "");
    this.selectedAction = true;
  }

  doesItemNeedTobeHighlighted(action: BeamMData, type: string) {
    if (type == "circle") {
      return action.isSelected ? "action-" + action.imageId + " circle-select" : "action-" + action.imageId;
    }
    return action.isSelected ? "arrow visible" : "arrow";
  }

  generateArrowPoints(x: number, y: number) {
    const coordinates: Array<{ x: number, y: number, direction: string }> =
      [{x: x, y: y, direction: 'down'},
        {x: x + 60, y: y - 60, direction: 'right'},
        {x: x - 60, y: y - 60, direction: 'left'},
        {x: x, y: y - 130, direction: 'up'}];
    let aPoints = [];
    for (let point of coordinates) {
      let yPos: number = +point.y + 50 + +10;
      let aPoint = this.PrepareCornerEdgePoint(point.x, yPos, point.direction, 10);
      aPoints.push(aPoint);
    }
    return aPoints;
  }

  public PrepareCornerEdgePoint(x: number, y: number, direction: string, offset: number): string {
    let points = '';
    points = x + ' ' + y + ',';

    if (direction === 'down') {
      points += (x - offset) + ' ' + (y - offset) + ',';
      points += (+x + +offset) + ' ' + (y - offset);
    } else if (direction === 'right') {
      points += (x - offset) + ' ' + (y - offset) + ',';
      points += (x - offset) + ' ' + (+y + +offset);
    } else if (direction === 'left') {
      points += (+x + +offset) + ' ' + (y - offset) + ',';
      points += (+x + +offset) + ' ' + (+y + +offset);
    } else if (direction === 'up') {
      points += (x + offset) + ' ' + (+y + +offset) + ',';
      points += (+x - +offset) + ' ' + (y + offset);
    }
    return points;
  }

  startDrag(event: any, action: BeamMData) {
    this.newPosX = event.layerX - action.position.x;
    this.newPosY = event.layerY - action.position.y;
    this.initatedDrag = true;
  }

  onDrag(event: any, action: BeamMData) {
    if (this.initatedDrag) {
      action.position.x = event.layerX - this.newPosX;
      action.position.y = event.layerY - this.newPosY;
      action.arrowPoints = this.generateArrowPoints(action.position.x, action.position.y);
      this.drawLinks(action);
    }
  }

  endDrag() {
    this.initatedDrag = false;
  }

  onSelectLink(action: BeamMData) {
    this.workflowService.pushSourceEdge(action);
  }

  drawLinks(action: BeamMData) {
    // get the sourceLink
    let sourceLink: any = this.workflowService.getSourceEdge();
    if (sourceLink && sourceLink.wfStepId != action.wfStepId) {
      let direction = "right";
      let x = sourceLink.position.x - 20;
      let y = sourceLink.position.y;
      if (action.position.y > sourceLink.position.y) {
        direction = "down";
        x = sourceLink.position.x;
        y = sourceLink.position.y + 20;
      }
      const sourceEdgePoints = this.generateSourceArrowEdgePoint(x, y, direction);
      const destEdgePoints = this.generateDestArrowEdgePoint(action.position.x, (action.position.y));
      /*
       * Line Edge Points
       */
      const linePoints = this.generateEdgePoints(sourceEdgePoints.x, sourceEdgePoints.y, destEdgePoints.x, destEdgePoints.y);
      const arrowPoints = this.PrepareCornerEdgePoint(destEdgePoints.x, destEdgePoints.y, "down", 10);
      const edge: WfEdge = {
        edgeId: Date.now(),
        wfStepId: action.wfStepId,
        isSelected: false,
        linePoints: linePoints,
        arrowPoints: arrowPoints,
      }
      sourceLink.edges = [];
      sourceLink.edges.push(edge);
    }
  }

  public generateEdgePoints(x1: number, y1: number, x2: number, y2: number): string {
    let points = x1 + ' ' + y1 + ',';

    if (x2 !== x1 && y2 > y1) {
      const ym = (+y1 + +y2) / 2;
      points += x1 + ' ' + ym + ',';
      points += x2 + ' ' + ym + ',';
    } else if (x2 !== x1 && y2 < y1) {
      const xm = Math.ceil((+x1 + +x2) / 2);
      points += x1 + ' ' + (+y1) + ',';
      points += xm + ' ' + (+y1) + ',';
      points += xm + ' ' + (y2) + ',';
      points += x2 + ' ' + (y2) + ',';
    }

    return points + x2 + ' ' + y2;
  }

  public generateSourceArrowEdgePoint(x: number, y: number, direction: string): any {
    if (direction === 'down') {
      return {x: x, y: +y + +20};
    } else if (direction === 'right') {
      return {x: +x + +60, y: y};
    }
    return {x: x, y: y};
  }

  public generateDestArrowEdgePoint(x: number, y: number) {
    return {x: x, y: y - 40};
  }
}
