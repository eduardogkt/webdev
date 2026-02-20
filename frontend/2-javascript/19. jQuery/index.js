$("h1").css("color", "red");
$("h1").css("attr"); // recuperar valor do estilo

$("h1").css("attr", "value"); // modificar estilo

$("h1").addClass("class1 class2"); // adicionar classes

$("h1").text("text"); // modificar conteúdo em texto

$("h1").html("html"); // modificar conteúdo html

$("h1").attr("attr"); // recuperar valor de atributo

$("h1").attr("attr", "value"); // modificar o valor de atributo

$("h1").attr("class"); // lista todas as classes do elemento

$("h1").on("eventType", callback); // equivalente a .addEventListener(eventType, callback)

$("h1").before().after(); // adiciona novo elemento antes/depois do elemento selecionado

$("h1").append().prepend(); // adiciona elemento antes/depois do conteúdo do elemento selecionado (adicionar filhos)

$("h1").remove(); // remove elemento

$("h1").hide().show().toggle(); // esconder/mostrar/toggle elemento

$("h1").slideUp / Down / Toggle().fadeIn / Out / Toggle(); // animações de mostrar/esconder

$("h1").animate({
    /*código css*/
}); // define animação personalizada (apenas para valores numéricos)
