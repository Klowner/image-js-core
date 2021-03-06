import Roi from './Roi';

// TODO check the links for the reference in the docs (@see)

/**
 * A layer that is caracterised by a ROIMap (@see ROIMap) and that will
 * generated automatically the corresponding ROI.
 * ROI should be a continuous
 * surface (it is not tested when it is not continous ...)
 * From the roiMap, the ROILayer will create the corresponding
 * ROI (@see ROI).
 *
 * @class RoiManager
 * @param {Image} image
 * @param {object} [options]
 */
/**
 * @class RoiLayer
 */
export default class RoiLayer {
    constructor(roiMap, options) {
        this.roiMap = roiMap;
        this.options = options;
        this.roi = this.createRoi();
    }

    /**
     * Roi are created from a roiMap
     * The roiMap contains mainty an array of identifiers that define
     * for each data to which Roi it belongs
     * @memberof RoiManager
     * @instance
     */

    createRoi() {
        // we need to find all all the different IDs there is in the data
        let data = this.roiMap.data;
        let mapIDs = {};
        this.roiMap.positive = 0;
        this.roiMap.negative = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i] && !mapIDs[data[i]]) {
                mapIDs[data[i]] = true;
                if (data[i] > 0) {
                    this.roiMap.positive++;
                } else {
                    this.roiMap.negative++;
                }
            }
        }

        let rois = {};

        for (let mapID in mapIDs) {
            rois[mapID] = new Roi(this.roiMap, mapID * 1);
        }

        let width = this.roiMap.width;
        let height = this.roiMap.height;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let target = y * width + x;
                if (data[target] !== 0) {
                    let mapID = data[target];
                    if (x < rois[mapID].minX) rois[mapID].minX = x;
                    if (x > rois[mapID].maxX) rois[mapID].maxX = x;
                    if (y < rois[mapID].minY) rois[mapID].minY = y;
                    if (y > rois[mapID].maxY) rois[mapID].maxY = y;
                    rois[mapID].meanX += x;
                    rois[mapID].meanY += y;
                    rois[mapID].surface++;
                }
            }
        }

        let roiArray = [];
        for (let mapID in mapIDs) {
            rois[mapID].meanX /= rois[mapID].surface;
            rois[mapID].meanY /= rois[mapID].surface;
            roiArray.push(rois[mapID]);
        }

        return roiArray;
    }

}
