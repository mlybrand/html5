(function() {
    var SuperEditor = function() {
        var view, fileName, isDirty = false,
            unsavedMsg = 'Unsaved changes will be lost. Are you sure?',
            unsavedTitle = 'Discard changes';
        var markDirty = function() {
            isDirty = true;
        };
        var markClean = function() {
            isDirty = false;
        };
        var checkDirty = function() {
            if(isDirty) { return unsavedMsg; }
        };
        //window.addEventListener('beforeunload', checkDirty, false);
        window.onbeforeunload = checkDirty;
        
        var jump = function(e) {
            var hash = location.hash;
            if (hash.indexOf('/') > -1) {
                var parts = hash.split('/'),
                    fileNameEl = document.getElementById('file_name');
                view = parts[0].substring(1) + '-view';
                fileName = parts[1];
                fileNameEl.innerHTML = fileName;
            } else {
                if (!isDirty || confirm(unsavedMsg, unsavedTitle)) {
                    markClean();
                    view = 'browser-view';
                    if (hash != '#list') {
                        location.hash = '#list';    
                    }
                } else {
                    location.href = e.oldURL;
                }
            }
            document.body.className = view;
        };
        jump();
        window.addEventListener('hashchange', jump, false);
        var editVisualButton = document.getElementById('edit_visual'),
            visualView = document.getElementById('file_contents_visual'),
            visualEditor = document.getElementById('file_contents_visual_editor'),
            visualEditorDoc = visualEditor.contentDocument,
            editHtmlButton = document.getElementById('edit_html'),
            htmlView = document.getElementById('file_contents_html'),
            htmlEditor = document.getElementById('file_contents_html_editor');
        visualEditorDoc.designMode = 'on';
        visualEditorDoc.addEventListener('keyup', markDirty, false);
        htmlEditor.addEventListener('keyup', markDirty, false);
        var updateVisualEditor = function(content) {
            visualEditorDoc.open();
            visualEditorDoc.write(content);
            visualEditorDoc.close();
            visualEditorDoc.addEventListener('keyup', markDirty, false);
        };
        var updateHtmlEditor = function(content) {
            htmlEditor.value = content;
        };
        var toggleActiveView = function() {
            if(htmlView.style.display == 'block') {
                editVisualButton.className = 'split_left active';
                visualView.style.display = 'block';
                editHtmlButton.className = 'split_right';
                htmlView.style.display = 'none';
                updateVisualEditor(htmlEditor.value);
            } else {
                editHtmlButton.className = 'split_right active';
                htmlView.style.display = 'block';
                editVisualButton.className = 'split_left';
                visualView.style.display = 'none';
                var x = new XMLSerializer();
                var content = x.serializeToString(visualEditorDoc);
                updateHtmlEditor(content);
            }
        };
        editVisualButton.addEventListener('click', toggleActiveView, false);
        editHtmlButton.addEventListener('click', toggleActiveView, false);
        var visualEditorToolbar = document.getElementById('file_contents_visual_toolbar');
        var richTextAction = function(e) {
            var command,
                node = (e.target.nodeName === "BUTTON") ? e.target : e.target.parentNode;
            if(node.dataset) {
                command = node.dataset.command;
            } else {
                command = node.getAttribute('data-command');
            }
            var doPopupCommand = function(command, prompText, promptDefault) {
                visualEditorDoc.execCommand(command, false, prompt(prompText, promptDefault));
            };
            if (command === 'createLink') {
                doPopupCommand(command, 'Enter link URL:', 'http://www.example.com');
            } else if (command === 'insertImage') {
                doPopupCommand(command, 'Enter image URL:', 'http://www.example.com/image.png');
            } else if (command === 'insertMap') {
                if (navigator.geolocation) {
                    node.innerHTML = 'Loading';
                    navigator.geolocation.getCurrentPosition(function(pos) {
                        var coords = pos.coords.latitude + ',' + pos.coords.longitude;
                        var img = 'http://maps.googleapis.com/maps/api/staticmap?markers=' + coords + '&zoom=11&size=200x200&sensor=false';
                        visualEditorDoc.execCommand('insertImage', false, img);
                        node.innerHTML = 'Location Map';
                    });
                } else {
                    alert('Geolocation not available', 'No geolocation data');
                }
            } else {
                visualEditorDoc.execCommand(command);
            }
        };
        visualEditorToolbar.addEventListener('click', richTextAction, false);
    };
    var init = function() {
        new SuperEditor();
    };
    window.addEventListener('load', init, false);
}());