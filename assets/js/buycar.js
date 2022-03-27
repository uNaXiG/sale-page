
{
    var all_city = [];      // 拿來放全台縣市的list
    var town = [];      // 拿來放各個縣市中的鄉鎮市區
    var select_class_1 = "";    // 看選擇的物流方式是何種0/1/2...
    var city = "";      // 已讀中的縣市
    var city_list = []; // 將每個不同的縣市塞入list
    var town_list = []; // 將每個"地址"中的 XX鄉/XX鎮/XX市/XX區塞入list
    var name711_list = []; // 將每個711店面+地址塞入list
    var namefm_list = []; // 將每個全家店面+地址塞入list
    var addr = [];      // 將每個店名塞入list
    var sel_city = "";  // 已選中的縣市
    var addr_list = [];
    var fm_list = [];   //全家店名+地址
    var send_msg = "";  // 最後要送出的所有訂單資訊
    var lock = false;   // 避免重複將訂單資訊串接字串
    var record_name = "";         // 用來記錄目前所選的店名
    var temp_price = 0;
    var info_total_price = 0;   // total price
}

function pass_data(info) {
    var info_spl = info.split(",");

    /// initial value ///
    var info_id = [];		// list for each item id
    var info_imgpath = [];		// list for each item image
    var info_name = [];		// list for each item name
    var info_size = [];		// list for each item size
    var info_price = [];	// list for each item price
    var info_count = [];	// list for each item count
    for (i = 0; i < info_spl.length - 1; i++) {
        info_id.push(info_spl[i].split("_")[0]);
        info_imgpath.push("static/saleimg/sale" + info_id[i].split(":")[1] + ".jpg");
        info_name.push(info_spl[i].split("_")[1]);
        info_size.push(info_spl[i].split("_")[2]);
        info_price.push(info_spl[i].split("_")[3]);
        info_count.push(info_spl[i].split("_")[4]);
    }

    var parent = document.getElementById("car_body");
    var tr;
    for (i = 0; i < info_spl.length - 1; i++) {
        tr = document.createElement("tr");
        tr.setAttribute("id", "tr_" + i);
        parent.appendChild(tr);
    }

    /*
    /// creating new table colonm id for each items ///
    for (i = 0; i < info_spl.length - 1; i++) {
        var td = document.createElement("td");
        td.setAttribute("style", "text-align: center; word-wrap: break-word;");
        td.setAttribute("id", "tid" + i);
        var textnode = document.createTextNode((parseInt(info_id[i].split(":")[1]) + 1).toString());
        td.appendChild(textnode);
        document.getElementById("tr_" + i).appendChild(td);
    }
    */

    /// creating new table colonm img for each items ///
    for (i = 0; i < info_spl.length - 1; i++) {
        var td = document.createElement("td");
        td.setAttribute("style", "text-align: center; word-wrap: break-word;");
        td.setAttribute("id", "timg" + i);
        var img = document.createElement("img");
        img.setAttribute("style", "width: 35px; height = auto;");
        img.setAttribute("src", info_imgpath[i]);
        td.appendChild(img);
        document.getElementById("tr_" + i).appendChild(td);
    }


    /// creating new table colonm name for each items ///
    for (i = 0; i < info_spl.length - 1; i++) {
        var td = document.createElement("td");
        td.setAttribute("style", "text-align: left; word-wrap: break-word;");
        td.setAttribute("id", "tname" + i);
        var textnode = document.createTextNode(info_name[i].split(":")[1].split(" ")[1]);
        td.appendChild(textnode);
        document.getElementById("tr_" + i).appendChild(td);
    }

    /// creating new table colonm size for each items ///
    for (i = 0; i < info_spl.length - 1; i++) {
        var td = document.createElement("td");
        td.setAttribute("style", "text-align: left; word-wrap: break-word;");
        td.setAttribute("id", "tsize" + i);
        var textnode = document.createTextNode(info_size[i].split(":")[1]);
        td.appendChild(textnode);
        document.getElementById("tr_" + i).appendChild(td);
    }

    /// creating new table colonm price for each items ///
    for (i = 0; i < info_spl.length - 1; i++) {
        var td = document.createElement("td");
        td.setAttribute("style", "text-align: left; word-wrap: break-word;");
        td.setAttribute("id", "tprice" + i);
        var textnode = document.createTextNode(info_price[i].split(":")[1]);
        td.appendChild(textnode);
        document.getElementById("tr_" + i).appendChild(td);
    }

    /// creating new table colonm count for each items ///
    for (i = 0; i < info_spl.length - 1; i++) {
        var td = document.createElement("td");
        td.setAttribute("style", "text-align: left; word-wrap: break-word;");
        td.setAttribute("id", "tcount" + i);
        var textnode = document.createTextNode(info_count[i].split(":")[1]);
        td.appendChild(textnode);
        document.getElementById("tr_" + i).appendChild(td);
    }

    for (i = 0; i < info_spl.length - 1; i++) {
        var p = document.getElementById("tprice" + i).textContent;  // each item price
        var c = document.getElementById("tcount" + i).textContent;  // each item count
        info_total_price += (p * c);    // total price
    }

    document.getElementById("total_price_in_car").textContent = "$ " + info_total_price;

    get_town();
    get_711();
    get_familymart();

    // 等讀取完所有商家資料才將mask拿掉 //
    var x = document.getElementById("mask");
    x.remove();
    send_msg = info + "total price:";
    //var post_str_2 = send_msg;
    document.getElementById("send_str_2").value = send_msg;
}

function onlyNumberKey(evt) {

    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

function get_711() {
    fetch("static/dataset/dataseven.json")	// reload 7-11 dataset
        .then(response => {
            return response.json();
        })
        .then(jsdata => {
            //console.log(jsdata.items);
            var items = jsdata;
            len = parseInt(JSON.stringify(jsdata.length));
            pass_data_711(items, len);
        });
}

function get_familymart() {
    fetch("static/dataset/datafm.json")	// reload family mart dataset
        .then(response => {
            return response.json();
        })
        .then(jsdata => {
            //console.log(jsdata.items);
            var items = jsdata["data"];
            var len = jsdata["data"].length;
            pass_data_fm(items, len);
        });
}


function get_town() {
    fetch("static/dataset/citytowndata.json")	// reload taiwan 
        .then(response => {
            return response.json();
        })
        .then(jsdata => {
            //console.log(jsdata.items);
            len = parseInt(JSON.stringify(jsdata.length));
            for (i = 0; i < len; i++) {
                var keys = Object.keys(jsdata[i]);
                all_city.push(keys[0]);
                town.push(jsdata[i][keys[0]])

            }

        });
}


/// initial each items attribute ///
function pass_data_711(items, len) {
    for (i = 0; i < len; i++) {
        if (city == "") {
            // 初始狀態 //
            city = items[i]['縣市'];    // 更新第一筆資料
            city_list.push(city);       // 之後將這筆資料塞入list
        }
        else {
            // 假設遇到相同的縣市則不進行塞入city list的工作 //
            if (city != items[i]['縣市']) {
                city = items[i]['縣市'];    // 更新縣市字串作暫存
                city_list.push(city);       // 塞入新的縣市到list

            }
        }

        // 記錄一筆新的縣市+店號+店名 //
        name711_list.push("(" + items[i]['店號'] + items[i]['店名'] + ")");
        // 記錄一筆新的店名+地址 //
        addr.push(items[i]['店名'] + ":" + items[i]['地址']);

    }
}


function pass_data_fm(items, len) {
    // 資料整理 將所有的全家 店名地址 整理成字串並加入到fm_list中 //
    for (i = 0; i < len; i++) {
        var v = (Object.values(items[i])[0]);
        for (j = 0; j < v.length; j++) {
            var record = v[j];
            fm_list.push(record);
        }
    }
}

// 刪除slesect box 的內容 //
// 參數意義 : 物流方式的選擇框為0 縣市為1 店名為2 //
//           當迴圈遇到比自己大的選擇框則將其清除 //
function clear_all_select(priority) {
    document.getElementById("addr").value = "";
    for (i = 0; i < 4; i++) {
        var s = document.getElementById("select_" + (i + 1));
        var len = s.options.length;
        if (i > priority) {
            for (j = len - 1; j > 0; j--) s.options[j] = null;
        }
    }
}

function add_city() {
    // 加入新的一筆縣市資料 //
    var parent = document.getElementById("select_2");
    for (i = 0; i < city_list.length; i++) {
        var op = document.createElement("option");
        op.setAttribute("value", (i + 1) + ":" + city_list[i]);
        var textnode = document.createTextNode(city_list[i]);
        op.appendChild(textnode);
        parent.appendChild(op);
    }
}

function select1() {
    var select_class_1 = document.getElementById("select_1").value.split(":")[0];
    if (select_class_1 == "") {   // 清除第二欄所有物件
        clear_all_select(0);
        temp_price = 0;
        document.getElementById("select_4").disabled = false;
        //document.getElementById("addr").readOnly = true;
    }

    else if (select_class_1 == "0") {     // 選擇 7 - 11
        clear_all_select(0);
        temp_price = 60;
        document.getElementById("select_4").disabled = false;
        //document.getElementById("addr").readOnly = true;

        add_city();
    }
    else if (select_class_1 == "1") {     // 選擇全家
        clear_all_select(0);
        temp_price = 60;
        document.getElementById("select_4").disabled = false;
        //document.getElementById("addr").readOnly = true;
        add_city();
    }
    else if (select_class_1 == "2") {     // 選擇宅配
        clear_all_select(0);
        temp_price = 80;
        document.getElementById("addr").disabled = false;
        document.getElementById("select_4").disabled = true;
        document.getElementById("addr").readOnly = false;
        add_city();
    }
}

function select2() {
    clear_all_select(1);
    var sel = parseInt(document.getElementById("select_2").value.split(":")[0]) - 1;
    sel_city = city_list[sel].replace("台", "臺");
    var index = 0;
    for (i = 0; i < all_city.length; i++) {
        if (sel_city == all_city[i]) {
            index = i;
            break;
        }
    }
    var l = town[index];
    var parent = document.getElementById("select_3");
    for (i = 0; i < l.length; i++) {
        var op = document.createElement("option");
        op.setAttribute("value", (i + 1).toString() + ":" + l[i]);
        var textnode = document.createTextNode(l[i]);
        op.appendChild(textnode);
        parent.appendChild(op);
    }
}

function select3() {
    clear_all_select(2);
    var parent = document.getElementById("select_4");
    // 7-11 //
    if (document.getElementById("select_1").value.split(":")[0] == "0") {
        var sel = document.getElementById("select_3").value.split(":")[1].replace("臺", "台");  // 取出鄉鎮市區名
        var name_list = [];
        addr_list = [];

        for (i = 0; i < addr.length; i++) {
            if (addr[i].split(":")[1].indexOf(sel_city.replace("臺", "台")) > -1) {
                if (addr[i].split(":")[1].indexOf(sel_city.replace("臺", "台") + sel) > -1) {
                    name_list.push(addr[i].split(":")[0]);
                    addr_list.push(addr[i].split(":")[1]);
                }
            }
        }

        for (i = 0; i < name_list.length; i++) {
            var op = document.createElement("option");
            op.setAttribute("value", (i + 1).toString() + ":" + name_list[i]);
            var textnode = document.createTextNode(name_list[i]);
            op.appendChild(textnode);
            parent.appendChild(op);
        }
    }
    // 全家 //
    else if (document.getElementById("select_1").value.split(":")[0] == "1") {
        var sel = document.getElementById("select_3").value.split(":")[1].replace("臺", "台");  // 取出鄉鎮市區名
        var name_list = [];
        addr_list = [];
        for (i = 0; i < fm_list.length; i++) {
            if (fm_list[i].split("+")[1].indexOf(sel_city + sel) > -1) {
                name_list.push(fm_list[i].split("+")[0]);
                addr_list.push(fm_list[i].split("+")[1]);
                namefm_list.push(fm_list[i]);
            }
        }
        for (i = 0; i < name_list.length; i++) {
            var op = document.createElement("option");
            op.setAttribute("value", (i + 1).toString() + ":" + name_list[i]);
            var textnode = document.createTextNode(name_list[i]);
            op.appendChild(textnode);
            parent.appendChild(op);
        }
    }
}

function select4() {
    clear_all_select(3);
    var x = parseInt(document.getElementById("select_4").value.split(":")[0]) - 1;
    document.getElementById("addr").value = addr_list[x];  // 將addr text box 內容設定為該筆紀錄的地址
    if (document.getElementById("select_1").value.split(":")[0] == "0") {
        for (i = 0; i < name711_list.length; i++) {
            var t = document.getElementById("select_4").value.split(":")[1];
            if (name711_list[i].indexOf(t) > -1) {
                record_name = name711_list[i];
                break;
            }
        }
    }
    else if (document.getElementById("select_1").value.split(":")[0] == "1") {
        for (i = 0; i < namefm_list.length; i++) {
            var t = document.getElementById("select_4").value.split(":")[1];
            if (namefm_list[i].indexOf(t) > -1) {
                record_name = namefm_list[i].split("+")[0];
                break;
            }
        }
    }

    //document.getElementById("addr").readOnly = true;    // 且不允取變更

}

function send_fun() {

    info_total_price += temp_price;
    send_msg += info_total_price;
    document.getElementById("send_str_2").value = send_msg;
    var pre_info = "取貨人姓名 : " + document.getElementById("name").value +
        ",取貨人手機 : " + document.getElementById("phone").value +
        ",取貨人信箱 : " + document.getElementById("email").value + ",";
    var ori_info = document.getElementById("send_str_2").value;
    var new_info = ",配送方式 : " + document.getElementById("select_1").value.split(":")[1] +
        ",配送位址 : " + record_name + document.getElementById("addr").value;
    document.getElementById("send_str_2").value = pre_info + ori_info + new_info;

}