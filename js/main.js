$(document).ready(function() {

  $("#hot-imgUrl").blur(function(){
    var imgUrl = this.value;
    if(imgUrl) {
      $(".hot-img-wrapper img").attr("src", imgUrl);
      capture(".hot-img-wrapper img");
    }
  });

});

function capture(el) {
  var isDown = false;
  var startX, startY, endX, endY;

  $(el).mousedown(function(e) {
    isDown = true;
    startX = e.pageX;
    startY = e.pageY;
    makeDot(startX - $(el).offset().left, startY - $(el).offset().top);
  });

  $(el).mousemove(function(e) {
    if(isDown) {
       makeRet((e.pageX - startX) + "px", (e.pageY - startY) + "px")
    }
  });

  $(el).mouseup(function(e) {
	  isDown = false;
	  endX = e.pageX;
	  endY = e.pageY;
	  //alert(startY);
	  var result = {
  	    left: (((startX - $(el).offset().left) / $(el).width()) * 100).toFixed(2) + "%",
  	    top: (((startY -$(el).offset().top) / $(el).height()) * 100).toFixed(2) + "%",
  	    width: (((endX - startX) / $(el).width()) * 100).toFixed(2) + "%",
  	    height: (((endY - startY) / $(el).height()) * 100).toFixed(2) + "%"
      };
    //alert(JSON.stringify(result));
    setVaule(result);
  });

  function makeDot(x, y) {
  	if($("#rectangle").length > 0) {
      $("#rectangle").css({"left":x,"top":y,"height":"1px","width":"1px"});
  	}
  	else {
      pointDiv = "<div style='height:1px;position:absolute;left:" + x +
  	  ";top:" + y + "px;width:1px;background:rgba(0, 0, 0, 0.5);overflow:hidden;' id='rectangle'></div>"; 
      $(el).parent().append(pointDiv);
  	}
  }

  function makeRet(width, height) { 
    $("#rectangle").css({"height":height,"width":width});
  }
  
}

function setVaule(result) {
  var content = result.width + " " + result.height + " " + result.left + " " + result.top;
  $(".pbox textarea").val(content); 
}
