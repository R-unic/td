import { Bezier } from "ez-bezier";
import { getChildrenOfType } from "instance-utility";

type NodeVectors = [
  p0: Vector3,
  p3: Vector3,
  direction0: Vector3,
  direction1: Vector3
];

export class BezierPath {
  /** Contains the total length of the path at the current segment and no further */
  private readonly segmentLengths: number[] = [];
  private cachedNodes: Part[] = [];
  private totalLength = 0;

  public constructor(
    public readonly map: MapModel
  ) {
    this.calculateLengths(); // initialize segment lengths & total length
  }

  /** Alias for `Path.getCFrameAtDistance(...).LookVector` */
  public getDirectionAtDistance(distance: number): Vector3 {
    return this.getCFrameAtDistance(distance).LookVector;
  }

  /** Alias for `Path.getCFrameAtDistance(...).Position` */
  public getPositionAtDistance(distance: number): Vector3 {
    return this.getCFrameAtDistance(distance).Position;
  }

  /**
   * @param distance Total distance travelled along the path
   * @param endInstruction Defines the behavior of what should happen if the end of the path is reached
   * @returns The CFrame of the point on the path that is `distance` units away from the start point
   */
  public getCFrameAtDistance(distance: number): CFrame {
    if (distance <= 0)
      return this.getStartPoint().CFrame;

    if (distance >= this.totalLength)
      return this.getEndPoint().CFrame;

    let low = 0;
    let high = this.segmentLengths.size() - 1;
    while (low < high) {
      const mid = math.floor((low + high) / 2);
      if (this.segmentLengths[mid] < distance)
        low = mid + 1;
      else
        high = mid;
    }

    const segmentIndex = low;
    const segmentDistance = this.segmentLengths[segmentIndex] - this.segmentLengths[segmentIndex - 1];
    const t = (distance - this.segmentLengths[segmentIndex - 1]) / segmentDistance;
    const [p0, p3, direction0, direction1] = this.getNodeVectors(segmentIndex - 1, segmentIndex);

    let position: Vector3;
    let tangent: Vector3;
    if (direction0.FuzzyEq(direction1, 0.001)) {
      position = p0.add(p3.sub(p0).mul(t));
      tangent = p3.sub(p0).Unit;
    } else {
      const bezier = this.createBezier(p0, p3, direction0, direction1);
      position = bezier.getPoint(t);
      tangent = bezier.getTangent(t);
    }

    return new CFrame(position, position.add(tangent));
  }

  /**
   * Calculate the length of every segment in the path as well as the total path length
   *
   * Initializes `totalLength` and all values in `segmentLengths`
   */
  private calculateLengths(): void {
    this.totalLength = 0; // in case of re-calculation for any wild reason
    this.segmentLengths.clear();
    this.segmentLengths.push(0);

    for (const i of $range(1, this.getNodes().size() - 1)) {
      const [p0, p3, direction0, direction1] = this.getNodeVectors(i - 1, i);
      let segmentLength = 0;

      if (direction0.FuzzyEq(direction1, 0.001))
        segmentLength = p3.sub(p0).Magnitude;
      else {
        const bezier = this.createBezier(p0, p3, direction0, direction1);
        const segmentsPerBezier = this.getSegmentsPerBezier();
        for (const j of $range(1, segmentsPerBezier)) {
          const t1 = (j - 1) / segmentsPerBezier;
          const t2 = j / segmentsPerBezier;
          const bezierP1 = bezier.getPoint(t1);
          const bezierP2 = bezier.getPoint(t2);
          segmentLength += bezierP2.sub(bezierP1).Magnitude;
        }
      }

      this.totalLength += segmentLength;
      this.segmentLengths.push(this.totalLength);
    }
  }

  private createBezier(...[p0, p3, direction0, direction1]: NodeVectors): Bezier {
    const curveSize = p3.sub(p0).Magnitude / 2;
    const p1 = p0.add(direction0.mul(curveSize)); // control point one
    const p2 = p3.sub(direction1.mul(curveSize)); // control point two
    return new Bezier(p0, p1, p2, p3);
  }

  private getNodeVectors(i1: number, i2: number): NodeVectors {
    const nodes = this.getNodes();
    const node0 = nodes[i1];
    const node1 = nodes[i2];
    const p0 = node0.Position;
    const p3 = node1.Position;
    const direction0 = node0.CFrame.LookVector;
    const direction1 = node1.CFrame.LookVector;
    return [p0, p3, direction0, direction1];
  }

  private getNodes(): Part[] {
    if (this.cachedNodes.isEmpty()) {
      const points = getChildrenOfType(this.map.PathNodes, "Part")
        .sort((a, b) => tonumber(a.Name)! < tonumber(b.Name)!);

      this.cachedNodes = [this.map.StartPoint, ...points, this.map.EndPoint];
    }

    return this.cachedNodes;
  }

  private getEndPoint(): Part {
    const nodes = this.getNodes();
    return nodes[nodes.size() - 1];
  }

  private getStartPoint(): Part {
    return this.getNodes()[0];
  }

  private getSegmentsPerBezier(): number {
    return this.map.GetAttribute<number>("SegmentsPerBezier") ?? 8;
  }
}