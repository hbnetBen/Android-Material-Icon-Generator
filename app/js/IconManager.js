'use strict';

let paper = require('js/paper-core.min'),
    IconBase = require('js/IconBase'),
    Icon = require('js/Icon');


/**
 * Handles adding icon + base.
 */
class IconManager {

    /**
     * @param canvas jquery canvas object
     * @param filePicker jquery input object
     */
    constructor(canvas, filePicker) {

        // place icon in center on canvas
        this.canvasSize = canvas.width(); // assuming width = height
        this.center = new paper.Point(this.canvasSize / 2, this.canvasSize / 2);

        // setup file picker to import
        filePicker.change(function() {
            var svgFile = filePicker[0].files[0];
            if (!svgFile) return;

            // read svg file
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                this.onSvgFileLoaded(event.target.result);
            }.bind(this);
            fileReader.readAsDataURL(svgFile);
        }.bind(this));
    }


    /**
     * Handles the svg file loaded callback.
     */
    onSvgFileLoaded(svgFileContent) {
        // remove any previous icons
        if (this.icon) this.icon.remove();

        // one time base setup
        if (!this.iconBase) {
            this.baseRadius = this.canvasSize / 2 * 0.9;
            this.iconBase = new IconBase(this.center, this.baseRadius, '#512DA8');
        }

        paper.project.importSVG(svgFileContent, {
                applyMatrix: true,
                onLoad: function (loadedItem) {
                    // check svg paths
                    var paths = loadedItem.children[0].children;
                    var iconPath = paths[0];
                    iconPath.strokeWidth = 0; // remove any strokes that were imported

                    // create icon and shadow
                    this.icon = new Icon(this.center, 'white', iconPath, this.iconBase);
                    this.icon.setSize(this.baseRadius * 2 * 0.65);

                }.bind(this)
            });
    }

}

module.exports = IconManager;
