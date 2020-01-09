import image2base64 from 'image-to-base64';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from "moment";




function save(chunk) {
  const fs = require("fs");
  const printer = fs.readFileSync(`${process.resourcesPath}\\notas\\IMPRESSORA.txt`, 'utf8')
  console.log(printer);
  
  var newdate=moment().subtract(1, "hour").format('DD_MM_YY-h-mm-ss');
  const pdfPath =`${process.resourcesPath}\\notas\\${newdate}FOLHA.pdf`;
  console.log(pdfPath);
  
  fs.appendFile(pdfPath, new Buffer(chunk), function (err) {
    if (err) {
      throw(err);
    } else {
    
      
      const exec = require('child_process').exec;

    exec(`PDFtoPrinter.exe "${pdfPath}" "${printer}"`, (error, stdout, stderr) => { 
        console.log(stdout); 
    });

     // return(chunk.length);
    }
});
}


function bodyRows(items) {
  
  
  var rowCount = items.length;
   var body = [];
   for (var j = 0; j < rowCount; j++) {
    console.log(items);
       body.push({
           id: j,
           quantidade:items[j].quantity,
           nome:items[j].name,
           preco:items[j].price,
           total:items[j].price*items[j].quantity,
       });
   }
   return body;
}
function recibo2(logo,items,state,pag,cartaos){
  console.log(state);
  
 console.log(bodyRows(items));
  image2base64(logo) // you can also to use url
  .then(
      (response) => {
          
          //console.log(bodyRows(items)); //cGF0aC90by9maWxlLmpwZw==
          var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format:"a4"
          });
          var pageSize = doc.internal.pageSize;
          var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          doc.addImage(response, 'JPEG', 3.5, 3.5, 30, 14)
          doc.setFontSize('20');
          doc.text(`RAFA COMÉRCIO`, 36, 10);
          doc.text(`DE PNEUS EIRELI`, 36, 17);
          doc.setFontSize('11');
          var da=moment().subtract(1, "hour").format("DD-MM-YYYY");
          var garan=doc.splitTextToSize(`Pneus novos e usados - Balanceamento - Geometria  
Acessórios - Suspensões - Películas - Escapamentos 
Rodas - Freios e CIA`,200);
          doc.rect(1.5, 1.5, 145, 207,'S');
          doc.text(garan, 3.5, 22);
          doc.setFontSize('10');
          doc.text(`CNPJ:15.083.092/0001-98`, 100, 8);
          doc.setFontSize('9.5');
          var rua=doc.splitTextToSize(`RUA VANTEIRO MARGOTTI,
          Nº 730, CENTRO`,50);
          doc.text(rua, 100, 13);
          rua=doc.splitTextToSize(`          CEP: 88.830-000,
   MORRO DA FUMAÇA-SC`,50);
          doc.text(rua, 100, 21.5);
          doc.setFontSize('10');
          doc.setFontStyle('bold');
          doc.rect(42.5, 28, 104, 6,'S');
          doc.text(`  FONE: (48) 3434-1872 ou (48) 99614-7868 (com WhatsApp)`, 44, 32);
          doc.line( 1.5,34,146.5,34);
          doc.setFontSize('15');
          doc.setFontStyle('bold');
          doc.text(`CONTROLE`, 111, 32+garan.length*3);
          doc.setFontSize('10');
          doc.setFontStyle('normal');
          doc.text(`|------ NÃO É DOCUMENTO FISCAL ------|`, 40, 30+garan.length*3);
          doc.text(`DATA: ${da}`, 3, 30+garan.length*3);
          doc.text(`NOME:__${state.ClienteNome}__N: ${state.transactionId.substring(0,5)}`, 3, 38+garan.length*3);
          doc.text(`ENDEREÇO:_${state.ClienteEndereco}_`, 3, 45+garan.length*3);
          if(state.ClienteNome){
            doc.text(`NOME:__${state.ClienteNome}__N: ${state.transactionId.substring(0,5)}`, 3+pageWidth, 38+garan.length*3);
            doc.text(`ENDEREÇO:_${state.ClienteEndereco}_`, 3+pageWidth, 45+garan.length*3);
            if(state.carro[0].text!="Nenhum"){
              doc.text(`VEÍCULO:__${state.carro[0].text}__PLACA:_${state.carro[0].placa}_COR:_${state.carro[0].cor}_`, 3, 53+garan.length*3);
              }else{
              doc.text(`VEÍCULO:_________________________PLACA:___________COR:______________`, 3, 53+garan.length*3);  
              }
            }else{
              doc.text(`NOME:___________________________________N: ${state.transactionId.substring(0,5)}`, 3+pageWidth, 38+garan.length*3);
              doc.text(`ENDEREÇO:_____________________________________________________`, 3+pageWidth, 45+garan.length*3);
              doc.text(`VEÍCULO:_________________________PLACA:___________COR:______________`, 3+pageWidth, 53+garan.length*3);  
            }  
          doc.line( 1.5,64,146.5,64);
          
          var i=0,tb=[],to=0;
          
          for(i=0;i<items.length;i++){
           
            tb.push({quantidade:items[i].quantity,
                    nome:items[i].name,
                    preco:items[i].price,
                    total:parseFloat(items[i].price)*parseFloat(items[i].quantity),});
            to+=parseFloat(items[i].price)*parseFloat(items[i].quantity);
  
          }
          console.log(tb);
          
          tb.push({quantidade:1,
            nome:`--------------------------------------------------------------`,
            preco:"--",
            total:"--"});
         
          if(pag.cartao){
            var d;
            if(cartaos.debito){
              d="Débito";
              tb.push({quantidade:1,
                nome:"PAGO NO CARTÃO: "+d,
                preco:"--",
                total:"--"});
            }else{
              d=`crédito ${cartaos.num}x de ${parseFloat((pag.total/cartaos.num)-pag.desconto).toFixed(2)}`;
              tb.push({quantidade:1,
                nome:"PAGO NO CARTÃO: "+d,
                preco:"--",
                total:"--"});
            }
            
            tb.push({quantidade:1,
              nome:"Taxa Cartão",
              preco:parseFloat(pag.total-to-pag.desconto).toFixed(2),
              total:parseFloat(pag.total-to-pag.desconto).toFixed(2)});
            tb.push({quantidade:1,
              nome:`DESCONTO: R$ ${pag.desconto}`,
              preco:"--",
              total:"--"});    

          }else{
            tb.push({quantidade:1,
              nome:`DESCONTO: R$ ${pag.desconto}`,
              preco:"--",
              total:"--"});  
            tb.push({quantidade:1,
              nome:`PAGO: R$ ${pag.totalPayment}`,
              preco:"--",
              total:"--"});
            tb.push({quantidade:1,
              nome:`TROCO: R$ ${pag.changeDue}`,
              preco:"--",
              total:"--"});    
          }
          
          tb.push({quantidade:1,
            nome:`GARANTIA: ${state.garantia}`,
            preco:"--",
            total:"--"});
            
            if(state.publicInfo){
          tb.push({quantidade:1,
            nome:`INFORMAÇÕES: ${state.info}`,
            preco:"--",
            total:"--"});  
            }
          tb.push({quantidade:1,
            nome:`-------------------------------------------------------------- `,
            preco:"--",
            total:"--"});  
          tb.push({quantidade:1,
            nome:`OBRIGADO PELA PREFERÊNCIA!`,
            preco:"--",
            total:"--"});  
            var t=[];
            tb.forEach(element => {      
                  var temp = [element.quantidade,element.nome,element.preco,element.total];
                 
                  t.push(temp);
                  
          
              }); 
            
          doc.autoTable([['Quant'], ['Discriminação'], ['P.Unit'],['TOTAL']],t,
           
            {startY: 64,
            startX: 1.5, 
            margin: 1.5,
            headStyles: {fillColor: [0, 0, 0]},  
            tableWidth:-3.5+pageWidth/2});
          doc.setFontSize('12');
          doc.text(`__________________________________`, 5, 202);
          doc.text(`Assinatura`, 36, 207);
          doc.text(`TOTAL R$ `, 86, 199);
          doc.roundedRect(108, 192.5, 36, 10,1,1,'S');
          doc.setFontSize('14');
          doc.text(`${parseFloat(pag.total).toFixed(2)}`,110, 199);
          doc.setFontSize('10');
          doc.text(`*Não vale como recibo`, 108, 207);
              
          pageWidth=(pageWidth/2);
              
          doc.addImage(response, 'JPEG', 3.5+pageWidth, 3.5, 30, 14);
          doc.setFontSize('20');
          doc.text(`RAFA COMÉRCIO`, 36+pageWidth, 10);
          doc.text(`DE PNEUS EIRELI`, 36+pageWidth, 17);
          doc.setFontSize('11');
          da=moment().subtract(1, "hour").format("DD-MM-YYYY");
          garan=doc.splitTextToSize(`Pneus novos e usados - Balanceamento - Geometria  
Acessórios - Suspensões - Películas - Escapamentos 
Rodas - Freios e CIA`,200);
          doc.rect(pageWidth+1.5, 1.5, 145, 207,'S');
          doc.text(garan, 3.5+pageWidth, 22);
          doc.setFontSize('10');
          doc.text(`CNPJ:15.083.092/0001-98`, 100+pageWidth, 8);
          doc.setFontSize('9.5');
          rua=doc.splitTextToSize(`RUA VANTEIRO MARGOTTI,
          Nº 730, CENTRO`,50);
          doc.text(rua, 100+pageWidth, 13);
          rua=doc.splitTextToSize(`          CEP: 88.830-000,
   MORRO DA FUMAÇA-SC`,50);
          doc.text(rua, 100+pageWidth, 21.5);
          doc.setFontSize('10');
          doc.setFontStyle('bold');
          doc.rect(42.5+pageWidth, 28, 104, 6,'S');
          doc.text(`  FONE: (48) 3434-1872 ou (48) 99614-7868 (com WhatsApp)`, 44+pageWidth, 32);
          doc.line( pageWidth+1.5,34,146.5+pageWidth,34);
          doc.setFontSize('15');
          doc.setFontStyle('bold');
          doc.text(`CONTROLE`, 111+pageWidth, 32+garan.length*3);
          doc.setFontSize('10');
          doc.setFontStyle('normal'); 
          doc.text(`|------ NÃO É DOCUMENTO FISCAL ------|`, 40+pageWidth, 30+garan.length*3);
          doc.text(`DATA: ${da}`, 3+pageWidth, 30+garan.length*3);
          if(state.ClienteNome){
          doc.text(`NOME:__${state.ClienteNome}__N: ${state.transactionId.substring(0,5)}`, 3+pageWidth, 38+garan.length*3);
          doc.text(`ENDEREÇO:_${state.ClienteEndereco}_`, 3+pageWidth, 45+garan.length*3);
          if(state.carro[0].text!="Nenhum"){
            doc.text(`VEÍCULO:__${state.carro[0].text}__PLACA:_${state.carro[0].placa}_COR:_${state.carro[0].cor}_`, 3, 53+garan.length*3);
            }else{
            doc.text(`VEÍCULO:_________________________PLACA:___________COR:______________`, 3, 53+garan.length*3);  
            }
          }else{
            doc.text(`NOME:___________________________________N: ${state.transactionId.substring(0,5)}`, 3+pageWidth, 38+garan.length*3);
            doc.text(`ENDEREÇO:_____________________________________________________`, 3+pageWidth, 45+garan.length*3);
            doc.text(`VEÍCULO:_________________________PLACA:___________COR:______________`, 3, 53+garan.length*3);  
          }  
          doc.line( pageWidth+1.5,64,146.5+pageWidth,64);
            
          doc.autoTable([['Quant'], ['Discriminação'], ['P.Unit'],['TOTAL']],t,
            {startY: 64,
            //startX:  pageWidth+ 6, 
            margin: {left:pageWidth+1.5},
            headStyles: {fillColor: [0, 0, 0]},  
            tableWidth:pageWidth-3.5,});
            
          doc.setFontSize('12');
          doc.text(`__________________________________`, 5+pageWidth, 202);
          doc.text(`Assinatura`, 36+pageWidth, 207);
          doc.text(`TOTAL R$ `, 86+pageWidth, 199);
          doc.roundedRect(108+pageWidth, 192.5, 36, 10,1,1,'S');
          doc.setFontSize('14');
          doc.text(`${parseFloat(pag.total).toFixed(2)}`,110+pageWidth, 199);
          doc.setFontSize('10');
          doc.text(`*Não vale como recibo`, 108+pageWidth, 207);
          //var doc2=doc;
          //doc.autoPrint();
          //const { remote} = require('electron') 
          //const currentWindow = remote.getCurrentWindow()
          //currentWindow.webContents.print({silent: false, printBackground: false, deviceName: 'POS-58'});
          //window.open(doc.output('bloburl'), '_blank');
          console.log("tset");
          
          save(doc.output('arraybuffer'));    
          //console.log(te);
          
          
          return true;
        }
  )
  .catch(
      (error) => {
        return false;
      }
  )
  
            }
            export default recibo2;           
  
            