var ViewManager = (function() {
  function setTitle(title) {
    if (!title) {
      $id('view-title').textContent = '';
    } else {
      $id('view-title').textContent = ' - ' + title;
    }
  }

  function reset() {
    var evt = document.createEvent('Event');
    evt.initEvent('CloseWidget', true, true);
    document.dispatchEvent(evt);

    $expr('#container .item').forEach(function reset_func(elem) {
      var viewId = elem.dataset.linkedView;
      if (!viewId) {
        return;
      }

      var linkedView = $id(viewId);
      if (!linkedView) {
        return;
      }

      linkedView.dataset.shown = false;
    });
  }

  function showContent(viewId, showData) {
    var viewElem = $id(viewId);
    if (!viewElem) {
      return;
    }
    var viewOldId = null;
    var contentView = $expr('#container .item');
    for (var i = 0; i < contentView.length; i++) {
      var oldId = contentView[i].dataset.linkedView;
      if (!oldId) {
        continue;
      }
      var linkedView = $id(oldId);
      if (!linkedView) {
        continue;
      }
      if (viewId == 'connect-view') {
        linkedView.dataset.firstshown = false;
      }
      if (linkedView.dataset.shown == "true") {
        viewOldId = oldId;
        continue;
      } else {
        continue;
      }
    }

    if ( !! viewOldId) {
      if (viewOldId == viewId) {
        return;
      }
      if (viewOldId == "contact-view" && viewId != 'connect-view') {
        var sub = $id('contact-edit-view');
        if (sub.hidden == false) {
          new AlertDialog({
            message: _('save-contacts-confirm'),
            showCancelButton: true,
            okCallback: function() {
              $id(viewOldId).dataset.shown = false;
              switchContent(viewId, showData, viewElem);
            }
          });
          return;
        }
      }
      $id(viewOldId).dataset.shown = false;
    }
    switchContent(viewId, showData, viewElem);
  }

  function switchContent(viewId, showData, viewElem) {
    viewElem.dataset.shown = true;
    if (viewId == "summary-view" || viewId == "connect-view" || viewId == "music-view" || viewId == "gallery-view" || viewId == "video-view") {
      $id('views').classList.add('hidden-views');
      $id('content').classList.remove('narrow-content');
    } else {
      $id('views').classList.remove('hidden-views');
      $id('content').classList.add('narrow-content');
    }
    var tabId = viewElem.dataset.linkedTab;
    if (!tabId) {
      return;
    }
    var tabElem = $id(tabId);
    // unselect selected item
    $expr('#container .selected').forEach(function unselect(elem) {
      elem.classList.remove('selected');
      elem.classList.remove(elem.id + '-selected');
      elem.classList.add(elem.id);
    });
    tabElem.parentNode.hidden = false;
    tabElem.classList.add('selected');
    tabElem.classList.add(tabId + '-selected');
    $expr('#container .content .view').forEach(function hideView(view) {
      view.hidden = true;
    });
    viewElem.hidden = false;
    _showViews(viewId + '-sub');
    var event;
    if (viewElem.dataset.firstshown != "true") {
      viewElem.dataset.firstshown = true;
      event = new CustomEvent('firstshow',{'detail': {'type': viewId, 'data': showData}});
    } else {
      event = new CustomEvent('othershow',{'detail': {'type': viewId, 'data': showData}});
    }
    customEventElement.dispatchEvent(event);
  }

  function _showViews(viewId) {
    var subView = $id(viewId);
    if (!subView) {
      return;
    }

    // Hide all other sibling card views
    $expr('#views .sub-view').forEach(function(cv) {
      if (cv.id == viewId) {
        cv.hidden = false;
      } else {
        cv.hidden = true;
      }
    });
  }

  function showViews(viewId) {
    var subView = $id(viewId);
    if (!subView) {
      return;
    }

    var parentNode = subView.parentNode;
    $expr('.card-view', parentNode).forEach(function(cv) {
      if (cv.id == viewId) {
        cv.hidden = false;
      } else {
        cv.hidden = true;
      }
    });
  }

  function init() {
    $expr('#container .item').forEach(function add_click_func(elem) {
      var viewId = elem.dataset.linkedView;
      if (!viewId) {
        return;
      }

      var linkedView = $id(viewId);
      if (!linkedView) {
        return;
      }

      // Link content view with tab
      linkedView.dataset.linkedTab = elem.id;
      elem.onclick = function(event) {
        if (this.dataset.linkedView != 'connect-view')
          showContent(this.dataset.linkedView);
      };
    });
  }

  window.addEventListener('load', function wnd_onload() {
    window.removeEventListener('load', wnd_onload);
    init();
  });

  return {
    // Show the view by the given id, and hide all other sibling views
    reset: reset,
    showContent: showContent,
    setTitle: setTitle,
    // Show the card view by given id, and hide all other sibling views
    showViews: showViews
  };
})();
