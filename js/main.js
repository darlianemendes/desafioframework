
function fazerGet(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    obterHeadersPaginacao(request);
    return JSON.parse(request.responseText);
}


function parseLinkHeader( linkHeader ) {
    return Object.fromEntries( linkHeader.split( ", " ).map( header => header.split( "; " ) ).map( header => [ header[1].replace( /"/g, "" ).replace( "rel=", "" ), header[0].slice( 1, -1 ) ] ) );
 }


function obterHeadersPaginacao(request){
    //https://github.com/typicode/json-server#paginate
    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
    //https://joshgoestoflatiron.medium.com/february-10-pagination-in-a-json-server-api-with-the-link-header-dea63eb0a835

    var headers = request.getAllResponseHeaders();
    var arr = headers.trim().split(/[\r\n]+/);
    var headerMap = {};
    
    arr.forEach(function (line) {
      var parts = line.split(': ');
      var header = parts.shift();
      var value = parts.join(': ');
      headerMap[header] = value;
    });
    var teste  = parseLinkHeader(headerMap.link);
    criaPaginacao(teste);
}

function construir(urlBase) {
    let posts = fazerGet(urlBase);
    var tabela = document.getElementById("tabela");
    tabela.innerHTML ="";
    for (let indice = 0; indice < posts.length; indice++) {
        const post = posts[indice];
        let linha = criaLinha(post);
        tabela.appendChild(linha);  
    }
}


function criaLinha(item) {
    linha = document.createElement("tr");
    for (let property in item) {
        td = document.createElement("td");
        td.innerHTML = item[property];
        linha.appendChild(td);
     }
  return linha;
}


function criaPaginacao(links){
    var paginacao = document.getElementById("paginacao");
    paginacao.innerHTML = "";
    for (let property in links) {
        a = document.createElement("a");
        a.addEventListener('click', function() { construir(links[property])}, false)
        a.innerHTML = property
        a.setAttribute("class", "paginacaolink");
        a.href = "#";
        paginacao.appendChild(a);
     }

}








