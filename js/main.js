$(document).ready(function() {

  capture(".hot-img-wrapper img");
  $("#hot-imgUrl").blur(function(){
    var imgUrl = this.value;
    if(imgUrl) {
      $(".close").trigger("click");
      if(!/^http:/.test(imgUrl)) {
        imgUrl = "http:" + imgUrl;
      }
      $(".hot-img-wrapper img").attr("src", imgUrl);
    }
  });

});

function capture(el) {
  var isDown = false;
  var index = 0;
  //被选区域在DOM中的位置及长宽
  var top,left,width,height;
  var results = [];
  //保存每个矩形的位置
  var rec = [];

  $(el).mousedown(function(e) {
    top = $(el).offset().top;
    left = $(el).offset().left;
    width = $(el).width();
    height = $(el).height();
    isDown = true;
    rec.push({startX: e.pageX, startY: e.pageY});
    makeDot(e.pageX - left, e.pageY - top, index);
    return false;
  });

  $(el).mousemove(function(e) {
    if(isDown) {
       makeRet((e.pageX - rec[index].startX) + "px", (e.pageY - rec[index].startY) + "px", index)
    }
    return false;
  });

  $(el).mouseup(function(e) {
	  isDown = false;
    setVaule(-1, updateResult(-1, rec[index].startX, rec[index].startY, e.pageX, e.pageY));
    index++;
    return false;
  });

  function makeDot(x, y, index) {
    pointDiv = $("<div style='cursor:crosshair;height:1px;position:absolute;left:" + x + "px;top:" + y + 
     "px;width:1px;background:rgba(0, 0, 0, 0.5);' id='rectangle-" + index +
      "'><span class='close'>x</span></div>");
    $(el).parent().append(pointDiv);

    //设置点击x按钮时删除事件
    pointDiv.children('.close').click(function(e) {
      $parent = $(this).parent();
      var pos = $parent.attr("id").match(/\d+$/);
      setVaule(pos, null);
      $parent.remove();
      return false;
    });

    //区域拖曳实现
    var iX, iY;
    pointDiv.mousedown(function(e) {
      iX = e.pageX;
      iY = e.pageY;
      $(this).css("border", "2px solid #eaeaea");
      $(this).bind("mousemove", onMouseMove);
      return false;
    });
    pointDiv.mouseup(function(e) {
       $(this).unbind("mousemove",onMouseMove);
       $(this).css("border", "");
       var pos = $(this).attr("id").match(/\d+$/);
       rec[pos].startX = e.pageX - iX + rec[pos].startX;
       rec[pos].startY = e.pageY - iY + rec[pos].startY;
       setVaule(pos, updateResult(pos, rec[pos].startX, rec[pos].startY));
       return false;
    });
    function onMouseMove(e) {
      var pos = $(this).attr("id").match(/\d+$/);
      var newLeft = e.pageX - iX + rec[pos].startX - left;
      var newTop = e.pageY - iY + rec[pos].startY - top;
      //判断是否在边界中
      if((newLeft >= 0 && newLeft <= width * (1- results[pos].split(" ")[1].split("%")[0] / 100)) && 
        (newTop >= 0 && newTop <= height * (1 - results[pos].split(" ")[2].split("%")[0] / 100))) {
        $(this).css({"left":newLeft, "top":newTop});
      }
      return false;
    }
  }

  function makeRet(width, height, index) { 
    $("#rectangle-" + index).css({"height":height,"width":width});
  }

  function updateResult(index, startX, startY, endX, endY) {
    if(endX && endY) {
      result = {
        'left': (((startX - left) / width) * 100).toFixed(2) + "%",
        'top': (((startY - top) / height)* 100).toFixed(2) + "%",
        'width': (((endX - startX) / width) * 100).toFixed(2) + "%",
        'height': (((endY - startY) / height) * 100).toFixed(2) + "%"
      };
    }
    else {
      result['left'] = (((startX - left) / width) * 100).toFixed(2) + "%";
      result['top'] = (((startY - top) / height)* 100).toFixed(2) + "%";
      result['width'] = results[index].split(" ")[1];
      result['height'] = results[index].split(" ")[2];
    }

    return result;
  }

  function setVaule(pos, result) {
    if(pos > -1 && result == null) {
      results.splice(pos, 1, "");
    }
    else {
      var line = "# " + result.width + " " + result.height + " " + result.left + " " + result.top; 
      if(pos > -1) {
        results.splice(pos, 1, line);
      }
      else {
        results.push(line);
      }
    }
    var content="";
    for(var i in results) {
      if(results[i] != "") {
        content += (results[i] + "\n");
      }
    }
    $(".pbox textarea").val(content); 
  }
}
