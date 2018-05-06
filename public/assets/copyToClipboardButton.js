$(function(){
    var clipboard = new ClipboardJS('.clipboard-copy-button',{
        text: function(trigger) {
            return $(trigger).parents(".form-group").find("input").val()
        }
    })
    function showTooltip(t) {
        var $t = $(t)
        $t.tooltip({
            title: "Copied!",
            trigger: "manual"
        })
        $t.tooltip("show")
        var timer = setTimeout(function() {
            if ($t.data("timer") != timer) return console.log("multiclick")
            $t.tooltip("hide")
        }, 1000).toString()
        $t.data("timer", timer)
    }
    clipboard.on("success", function(e) {
        showTooltip(e.trigger)
    })
})