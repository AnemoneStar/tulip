$(() => {
    $(".form-group[data-error]").each((index, elm) => {
        const errDiv = $("<div>").text($(elm).data("error")).addClass("invalid-feedback")
        $(elm).append(errDiv)
        $(elm).find(".input-group").append(errDiv)
        $(elm).find("input").addClass("is-invalid")
    })
})