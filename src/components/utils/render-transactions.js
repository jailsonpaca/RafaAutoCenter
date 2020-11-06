import React from "react";
import CompleteTransactions from "../CompleteTransactions";
import moment from "moment";
import _ from 'lodash';

const Rendertransactions = ({transactions,data,type,delet,pagar}) => {
  
    var ar = transactions.filter(function (a) {

        if (moment(a.date, "DD-MMM-YYYY HH:mm:ss").format("DD-MM-YYYY") === data) {

            return a;
        } return undefined;
    });

    ar = _.without(ar, undefined);

    if (ar.length === 0) {
        return <tr><td><p>Transações não encontradas</p></td></tr>;
    } else {




        var s, c, i, j;
        switch (type) {
            case 0:
                console.log("type 0");
                ar = _.orderBy(ar, [object => new moment(object.date, "DD-MMM-YYYY HH:mm:ss").format("YYYYMMDD HHmmss")], ['desc']);
                ar = ar.filter((e) => { if (e.estado === 0) { console.log(e); return e } return undefined });
                ar = _.without(ar, undefined);
                s = 0; c = 0;
                for (i = 0; i < ar.length; i++) {
                    if (ar[i].items) {
                        for (j = 0; j < ar[i].items.length; j++) {
                            s += parseFloat(ar[i].items[j].price) * parseFloat(ar[i].items[j].quantity);
                            if (ar[i].items[j].precofabrica) {
                                c += parseFloat(ar[i].items[j].precofabrica) * parseFloat(ar[i].items[j].quantity);
                            }
                        }
                    } else {
                        ar[i].items = [];
                    }
                    if (ar[i].desconto) {
                        c += parseFloat(ar[i].desconto);
                    }

                }
                document.getElementById("iSum").value = parseFloat(s, 10).toFixed(2);
                document.getElementById("lSum").value = parseFloat((s - c)).toFixed(2);
                break;
            case 1:
                console.log("type 1");
                ar = _.orderBy(ar, [object => new moment(object.date, "DD-MMM-YYYY HH:mm:ss").format("YYYYMMDD HHmmss")], ['desc']);
                ar = ar.filter((e) => { if (e.estado === 1) { console.log(e); return e } return undefined });
                ar = _.without(ar, undefined);
                s = 0; c = 0;
                for (i = 0; i < ar.length; i++) {
                    if (ar[i].items) {
                        for (j = 0; j < ar[i].items.length; j++) {
                            s += parseFloat(ar[i].items[j].price) * parseFloat(ar[i].items[j].quantity);
                            if (ar[i].items[j].precofabrica) {
                                c += parseFloat(ar[i].items[j].precofabrica) * parseFloat(ar[i].items[j].quantity);
                            }
                        }
                    } else {
                        ar[i].items = [];
                    }
                    if (ar[i].desconto) {
                        c += parseFloat(ar[i].desconto);
                    }

                }
                document.getElementById("iSum").value = parseFloat(s, 10).toFixed(2);
                document.getElementById("lSum").value = parseFloat((s - c)).toFixed(2);
                break;
            case 2:
                console.log("type 2");
                ar = _.orderBy(ar, [object => new moment(object.date, "DD-MMM-YYYY HH:mm:ss").format("YYYYMMDD HHmmss")], ['desc']);
                ar = ar.filter((e) => { if (e.estado === 2) { return e } return undefined });
                ar = _.without(ar, undefined);
                s = 0; c = 0;
                for (i = 0; i < ar.length; i++) {
                    if (ar[i].items) {
                        for (j = 0; j < ar[i].items.length; j++) {
                            s += parseFloat(ar[i].items[j].price) * parseFloat(ar[i].items[j].quantity);
                            if (ar[i].items[j].precofabrica) {
                                c += parseFloat(ar[i].items[j].precofabrica) * parseFloat(ar[i].items[j].quantity);
                            }
                        }
                    } else {
                        ar[i].items = [];
                    }
                    if (ar[i].desconto) {
                        c += parseFloat(ar[i].desconto);
                    }

                }
                document.getElementById("iSum").value = parseFloat(s, 10).toFixed(2);
                document.getElementById("lSum").value = parseFloat((s - c)).toFixed(2);
                break;
            case 3:
                console.log("type 3");
                ar = _.orderBy(ar, [object => new moment(object.date, "DD-MMM-YYYY HH:mm:ss").format("YYYYMMDD HHmmss")], ['desc']);
                ar = ar.filter((e) => { if (e.estado === 3) { console.log(e); return e } return undefined });
                ar = _.without(ar, undefined);
                s = 0; c = 0;
                for (i = 0; i < ar.length; i++) {
                    if (ar[i].quandoPagou) {
                        if (moment(ar[i].quandoPagou, "DD-MMM-YYYY HH:mm:ss").format("DD-MM-YYYY") === data) {
                            s += parseFloat(ar[i].pagou);
                        }
                    }
                }
                document.getElementById("iSum").value = 0;
                document.getElementById("lSum").value = 0;
                document.getElementById("rSum").value = s;
                break;
            default:
                console.log("todas(default)");

                ar = _.orderBy(ar, [object => new moment(object.date, "DD-MMM-YYYY HH:mm:ss").format("YYYYMMDD HHmmss")], ['desc']);

                s = 0; c = 0;
                for (i = 0; i < ar.length; i++) {
                    if (ar[i].items) {
                        for (j = 0; j < ar[i].items.length; j++) {
                            s += parseFloat(ar[i].items[j].price) * parseFloat(ar[i].items[j].quantity);
                            if (ar[i].items[j].precofabrica) {

                                c += parseFloat(ar[i].items[j].precofabrica) * parseFloat(ar[i].items[j].quantity);

                            }
                        }
                    } else {
                        ar[i].items = [];
                    }
                    if (ar[i].desconto) {

                        c += parseFloat(ar[i].desconto);

                    }


                }

                document.getElementById("iSum").value = parseFloat(s, 10).toFixed(2);
                document.getElementById("lSum").value = parseFloat((s - c)).toFixed(2);
                break;
        }


        return ar.map(transaction => (
            <CompleteTransactions key={transaction._id} onDelete={delet} onQuitar={pagar} {...transaction} />
        ));
    }
};

export default Rendertransactions;