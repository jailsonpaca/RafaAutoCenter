import image2base64 from 'image-to-base64';
import jsPDF from 'jspdf';
import moment from "moment";
const fs = require("fs");


function save(chunk) {
  //console.log(chunk);
  var newdate=moment().subtract(1, "hour").format('DD_MM_YY-h-mm-ss');
  const pdfPath =`${process.resourcesPath}\\notas\\${newdate}.pdf`;
  fs.appendFile(pdfPath, new Buffer(chunk), function (err) {
    if (err) {
      throw(err);
    } else {
    
      
      const exec = require('child_process').exec;
     console.log(pdfPath);
      
    exec(`PDFtoPrinter.exe "${pdfPath}" "POS-58"`, (error, stdout, stderr) => { 
      console.log(error);
      console.log(stderr);
      console.log(stdout); 
    });

     // return(chunk.length);
    }
});
}

function recibo1(logo,items,state,pag,cartaos){


  image2base64(logo) // you can also to use url
  .then(
      (response) => {
        
          //console.log(response); //cGF0aC90by9maWxlLmpwZw==
          var doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            // format: [4, 2]  // tinggi, lebar
            format: [150.5, 595]
          });
          doc.addImage(response, 'PNG', 5, 5, 43, 18);
          doc.setFontSize('6');
          doc.text(`N: ${state.transactionId.substring(0,5)}`, 38, 5);
          doc.text(`RAFA COMÉRCIO DE PNEUS EIRELI`, 5, 26);
          doc.text(`CNPJ:15.083.092/0001-98`, 5, 29);
          doc.text(`RUA VANTEIRO MARGOTTI,Nº 730,CENTRO`, 5, 32);
          doc.text(`CEP:88.830-000,MORRO DA FUMAÇA-SC`, 5, 35);
          doc.text(`FONE:(48) 3434-1872/(48) 99614-7868`, 5, 38);
          doc.text(`---------------------------------------------------------`, 5, 41);
          doc.text(`------ NÃO É DOCUMENTO FISCAL -----`, 5, 44);
          doc.text(`---------------------------------------------------------`, 5, 47);
          doc.text(`ITEM COD DESCRIÇÃO        QTD VALOR`, 5, 50);
          doc.text(`---------------------------------------------------------`, 5, 53);
          var i=0,st=[],garan=[],infos=[],l=0;
          
          for(i=0;i<items.length;i++){
           
            st=doc.splitTextToSize(`${i}: ${items[i].id} ${items[i].name} ${items[i].quantity} R$ ${items[i].price} `,43)
            
            doc.text(st, 5, 55+(i*3*l));    
            l=st.length;
          }
          var da=moment().subtract(1, "hour").format("DD-MM-YYYY HH:mm");
            if(pag.cartao){
              
                  doc.text(`---------------------------------------------------------`, 5, 55+(i*3*st.length));
                  doc.text(`TOTAL: R$ ${parseFloat(pag.total).toFixed(2)}`, 5, 58+(i*3*st.length));
                  doc.text(`DESCONTO: R$ ${pag.desconto}`, 5, 61+(i*3*st.length));
               
                  if(cartaos.debito){
               
                              if(state.publicInfo){
                              doc.text(`CARTÃO: DÉBITO`, 5, 64+(i*3*st.length));
                              garan=doc.splitTextToSize(`GARANTIA: ${state.garantia}`,43);
                              doc.text(garan, 5, 67+(i*3*st.length));
                              infos=doc.splitTextToSize(`INFORMAÇÕES: ${state.info}`,43);
                              doc.text(infos, 5, 70+(i*3*st.length));
                              doc.text(`DATA E HORA: ${da}`, 5, 73+(i*3*st.length)+garan.length*3+infos.length*3);
                              doc.text(`---------------------------------------------------------`, 5,76+(i*3*st.length)+garan.length*3+infos.length*3);
                              doc.text(`OBRIGADO PELA PREFERÊNCIA!`, 5, 79+(i*3*st.length)+garan.length*3+infos.length*3);  
                              }else{
                              doc.text(`CARTÃO: DÉBITO`, 5, 64+(i*3*st.length));
                              garan=doc.splitTextToSize(`GARANTIA: ${state.garantia}`,43);
                              doc.text(garan, 5, 67+(i*3*st.length));
                              doc.text(`DATA E HORA: ${da}`, 5, 70+(i*3*st.length)+garan.length*3+infos.length*3);
                              doc.text(`---------------------------------------------------------`, 5,73+(i*3*st.length)+garan.length*3);
                              doc.text(`OBRIGADO PELA PREFERÊNCIA!`, 5, 76+(i*3*st.length)+garan.length*3);  
                              }
                  }else{
               
                              if(state.publicInfo){
                              doc.text(`CARTÃO: ${cartaos.num}x`, 5, 64+(i*3*st.length));
                              garan=doc.splitTextToSize(`GARANTIA: ${state.garantia}`,43);
                              doc.text(garan, 5, 67+(i*3*st.length));
                              infos=doc.splitTextToSize(`INFORMAÇÕES: ${state.info}`,43);
                              doc.text(infos, 5, 70+(i*3*st.length));
                              doc.text(`DATA E HORA: ${da}`, 5, 73+(i*3*st.length)+garan.length*3+infos.length*3);
                              doc.text(`---------------------------------------------------------`, 5,76+(i*3*st.length)+garan.length*3+infos.length*3);
                              doc.text(`OBRIGADO PELA PREFERÊNCIA!`, 5, 79+(i*3*st.length)+garan.length*3+infos.length*3);  
                              }else{
               
                              doc.text(`CARTÃO: ${cartaos.num}x`, 5, 64+(i*3*st.length));
                              garan=doc.splitTextToSize(`GARANTIA: ${state.garantia}`,43);
                              doc.text(garan, 5, 67+(i*3*st.length));
                              doc.text(`DATA E HORA: ${da}`, 5, 70+(i*3*st.length)+garan.length*3+infos.length*3);
                              doc.text(`---------------------------------------------------------`, 5,73+(i*3*st.length)+garan.length*3);
                              doc.text(`OBRIGADO PELA PREFERÊNCIA!`, 5, 76+(i*3*st.length)+garan.length*3+infos.length*3);  
                              }  
                  }
            }else{
              
              if(state.publicInfo){
              doc.text(`---------------------------------------------------------`, 5, 55+(i*3*st.length));
              doc.text(`TOTAL: R$ ${parseFloat(pag.total,10).toFixed(2)}`, 5, 58+(i*3*st.length));
              doc.text(`DESCONTO: R$ ${pag.desconto}`, 5, 61+(i*3*st.length));
              doc.text(`PAGO: R$ ${parseFloat(pag.totalPayment,10).toFixed(2)}`, 5, 64+(i*3*st.length));
              doc.text(`TROCO: R$ ${parseFloat(pag.changeDue,10).toFixed(2)}`, 5, 67+(i*3*st.length));
              //doc.text(`GARANTIA: NÃO POSSUI`, 5, 64+(i*3*st.length));
              garan=doc.splitTextToSize(`GARANTIA: ${state.garantia}`,43);
              doc.text(garan, 5, 70+(i*3*st.length));
              infos=doc.splitTextToSize(`INFORMAÇÕES: ${state.info}`,43);
              doc.text(infos, 5, 73+(i*3*st.length));
              doc.text(`DATA E HORA: ${da}`, 5, 76+(i*3*st.length)+garan.length*3+infos.length*3);
              doc.text(`---------------------------------------------------------`, 5,79+(i*3*st.length)+garan.length*3+infos.length*3);
              doc.text(`OBRIGADO PELA PREFERÊNCIA!`, 5, 82+(i*3*st.length)+garan.length*3+infos.length*3);  
              }else{
                doc.text(`---------------------------------------------------------`, 5, 55+(i*3*st.length));
              doc.text(`TOTAL: R$ ${parseFloat(pag.total,10).toFixed(2)}`, 5, 58+(i*3*st.length));
              doc.text(`DESCONTO: R$ ${pag.desconto}`, 5, 61+(i*3*st.length));
              doc.text(`PAGO: R$ ${parseFloat(pag.totalPayment,10).toFixed(2)}`, 5, 64+(i*3*st.length));
              doc.text(`TROCO: R$ ${parseFloat(pag.changeDue,10).toFixed(2)}`, 5, 67+(i*3*st.length));
              //doc.text(`GARANTIA: NÃO POSSUI`, 5, 64+(i*3*st.length));
              garan=doc.splitTextToSize(`GARANTIA: ${state.garantia}`,43);
              doc.text(garan, 5, 70+(i*3*st.length));
              doc.text(`DATA E HORA: ${da}`, 5, 73+(i*3*st.length)+garan.length*3+infos.length*3);
              doc.text(`---------------------------------------------------------`, 5,76+(i*3*st.length)+garan.length*3+infos.length*3);
              doc.text(`OBRIGADO PELA PREFERÊNCIA!`, 5, 79+(i*3*st.length)+garan.length*3+infos.length*3);  

              }
            }
          
          //doc.autoPrint();
         // window.open(doc.output('bloburl'), '_blank');
          //doc.save(`${'example.pdf'}`);
          save(doc.output('arraybuffer'));    
          return true;
        }
  )
  .catch(
      (error) => {
        return false;
      }
  )
  
            }
            export default recibo1;           
  
            