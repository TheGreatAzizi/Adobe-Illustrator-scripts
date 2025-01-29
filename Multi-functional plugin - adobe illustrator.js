function showMainMenu() {
    if (app.documents.length === 0) {
        alert("No open documents found. Please open a document and try again.");
        return;
    }

    var doc = app.activeDocument;

    var dialog = new Window("dialog", "Illustrator Plugin: Main Menu");
    dialog.alignChildren = "fill";

    var instructions = dialog.add("statictext", undefined, "Choose a feature to execute:");
    instructions.alignment = "center";

    var renameButton = dialog.add("button", undefined, "Rename Layers");
    var mergeButton = dialog.add("button", undefined, "Merge Layers");
    var extractButton = dialog.add("button", undefined, "Extract Layer Info");
    var developerButton = dialog.add("button", undefined, "Developer");
    var cancelButton = dialog.add("button", undefined, "Cancel");

    developerButton.graphics.foregroundColor = developerButton.graphics.newPen(developerButton.graphics.PenType.SOLID_COLOR, [1, 0.84, 0], 1);
    developerButton.graphics.font = "Arial-Bold";
    developerButton.size = [150, 40];
    developerButton.addEventListener('mouseover', function () {
        developerButton.graphics.foregroundColor = developerButton.graphics.newPen(developerButton.graphics.PenType.SOLID_COLOR, [1, 0.92, 0], 1);
    });
    developerButton.addEventListener('mouseout', function () {
        developerButton.graphics.foregroundColor = developerButton.graphics.newPen(developerButton.graphics.PenType.SOLID_COLOR, [1, 0.84, 0], 1);
    });

    renameButton.onClick = function () {
        renameLayersByOption(doc, { renameAll: true });
    };

    mergeButton.onClick = function () {
        mergeLayers(doc);
    };

    extractButton.onClick = function () {
        extractLayerInfo(doc);
    };

    developerButton.onClick = function () {
        showDeveloperInfo();
    };

    cancelButton.onClick = function () {
        dialog.close();
    };

    dialog.show();
}

function showDeveloperInfo() {
    var developerDialog = new Window("dialog", "Developer Info");
    developerDialog.alignChildren = "fill";

    var instructions = developerDialog.add("statictext", undefined, "Programmed by THE AZIZI");
    instructions.alignment = "center";

    var linkText = developerDialog.add("statictext", undefined, "GitHub: https://github.com/TheGreatAzizi");
    linkText.alignment = "center";
    linkText.justify = "center";

    var closeButton = developerDialog.add("button", undefined, "Close");
    closeButton.onClick = function () {
        developerDialog.close();
    };

    developerDialog.show();
}

function renameLayersByOption(doc, options) {
    var layers = doc.layers;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        if (layer.locked || !layer.visible) {
            continue;
        }

        if (options.renameAll) {
            if (layer.textFrames.length > 0) {
                layer.name = "Text Layer " + (i + 1);
            } else if (layer.pathItems.length > 0) {
                layer.name = "Shape Layer " + (i + 1);
            } else if (layer.placedItems.length > 0) {
                layer.name = "Image Layer " + (i + 1);
            } else {
                layer.name = "Empty Layer " + (i + 1);
            }
        }
    }

    alert("Layers renamed successfully!");
}

function mergeLayers(doc) {
    var layers = doc.layers;
    if (layers.length < 2) {
        alert("Not enough layers to merge.");
        return;
    }

    var baseLayer = layers[layers.length - 1];

    for (var i = layers.length - 2; i >= 0; i--) {
        var layer = layers[i];

        while (layer.pageItems.length > 0) {
            layer.pageItems[0].move(baseLayer, ElementPlacement.PLACEATBEGINNING);
        }

        layer.remove();
    }

    alert("Layers merged into: " + baseLayer.name);
}

function extractLayerInfo(doc) {
    var layers = doc.layers;
    var info = "Layer Information:\n\n";

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        info += "Layer " + (i + 1) + ": " + layer.name + "\n";
        info += "  Visible: " + layer.visible + "\n";
        info += "  Locked: " + layer.locked + "\n";
        info += "  Text Frames: " + layer.textFrames.length + "\n";
        info += "  Path Items: " + layer.pathItems.length + "\n";
        info += "  Placed Items: " + layer.placedItems.length + "\n\n";
    }

    var outputFile = File.saveDialog("Save layer information as...");
    if (outputFile) {
        outputFile.open("w");
        outputFile.write(info);
        outputFile.close();
        alert("Layer information saved successfully.");
    }
}
showMainMenu();
