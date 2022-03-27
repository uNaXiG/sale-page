/// global vailable for each info ///
{
    var len;    // total data lines
    var id_history;		// id array
    var count;			// count array
    var total_price;	// total money
    var introduce;		// item introduce
    var size_arr;		// number of each item's size
    var remaining_arr;	// number of each item's size remaining
    var size_index = 0;
    var car_items = 0;	// the number of total items in car 
    var total_price_in_car = 0;	// the total price of each items in car
    var post_str = "";		// send form data string
    var remove_arr = [];      // array for remove recorde
}

//  讀取庫存資料 //
function read_json_data() {
    alert("本網站目前僅支援匯款方式繳費，未來將陸續加入多元支付方式，請安心購買。");
    fetch("dataset/saleitem.json")	// reload json file no-cache
        .then(response => {
            return response.json();
        })
        .then(jsdata => {
            //console.log(jsdata.items);
            var items = jsdata.items;
            len = parseInt(JSON.stringify(jsdata.items.length));
            pass_data(items, len);
        });
}

/// initial each items attribute ///
function pass_data(items, len) {
    id_history = new Array(len);
    introduce = new Array(len);
    count = new Array(len);
    total_price = new Array(len);
    size_arr = new Array(len);
    remaining_arr = new Array(len);
    for (i = 0; i < len; i++) {
        count[i] = 0;
        total_price[i] = 0;
    }

    for (i = 0; i < len; i++) {
        size_arr[i] = items[i].size.split(",");
        remaining_arr[i] = items[i].remaining.split(",");
        add_ele(items[i].id, items[i].src, items[i].name, items[i].introduce, size_arr[i], items[i].price);
    }
    //alert(document.getElementById("send_str").value);
}

/// add items ///
function add_ele(item_id, item_src, item_name, item_intro, item_size, item_price) {
    var h3_count = 0;
    var parent = document.getElementById("sale_area");
    var article = document.createElement("article");

    // 商品編號 //
    var img_link = document.createElement("a");
    img_link.setAttribute("id", "img_" + item_id);
    //img_link.setAttribute("href", "");
    img_link.setAttribute("class", "image");

    // 商品圖片 //
    var img = document.createElement("img");
    img.setAttribute("src", "saleimg/" + item_src);
    img_link.appendChild(img);

    // 商品名稱 //
    var tit = document.createElement("h3");
    tit.setAttribute("id", "name_" + item_id);
    var textnode = document.createTextNode((parseInt(item_id) + 1).toString() + " " + item_name);
    tit.appendChild(textnode);

    var intro_text = document.createElement("id", "intro_" + item_id);
    textnode = document.createTextNode(item_intro);
    intro_text.appendChild(textnode);

    // 價錢 //
    var p = document.createElement("h4");
    p.setAttribute("id", "price_" + item_id);
    textnode = document.createTextNode("單價 : NT." + item_price);
    p.appendChild(textnode);

    var ul = document.createElement("ul");
    ul.setAttribute("class", "actions");
    var li = document.createElement("li");

    var hr = document.createElement("hr");
    li.appendChild(hr);

    // 尺碼 //
    for (j = 0; j < item_size.length; j++) {

        /// creat size button for each item ///
        var btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("id", "item_" + item_id + "_" + item_size[j]);	// set size button id  =  item_"num"_["S/M/L"]
        btn.setAttribute("style", "width: 50px; padding:1px; margin:10px; text-align: center;");
        btn.setAttribute("onclick", "select_of_size(this.id)");	// set size button click event
        btn.setAttribute("value", item_size[j]);

        li.appendChild(btn);

    }

    var br = document.createElement("br");
    li.appendChild(br);

    textnode = document.createTextNode("數量 : 0 / 0 金額 : $ 0");

    var h4_num = document.createElement("h4");
    h4_num.setAttribute("style", "text-align: center;");
    h4_num.setAttribute("id", "num_of_item_" + item_id);
    h4_num.appendChild(textnode);
    li.appendChild(h4_num);

    // 減少 //
    var sub = document.createElement("input");
    sub.setAttribute("type", "button");
    sub.setAttribute("id", "item_" + item_id + "_sub_btn");		// set sub button id
    sub.setAttribute("style", "width: 45px; padding:1px; margin:10px; text-align: center;");
    sub.setAttribute("value", "-");
    sub.setAttribute("onclick", "calc_num_of_item(this.id)");	// set sub button click event
    li.appendChild(sub);

    // 增加 //
    var plus = document.createElement("input");
    plus.setAttribute("type", "button");
    plus.setAttribute("id", "item_" + item_id + "_plus_btn");	// set plus button id
    plus.setAttribute("style", "width: 45px; padding:1px; margin:10px; text-align: center;");
    plus.setAttribute("value", "+");
    plus.setAttribute("onclick", "calc_num_of_item(this.id)");	// set plus button click event
    li.appendChild(plus);

    // 購物車 //
    var add_to_car = document.createElement("a");
    //add_to_car.setAttribute("type", "button");
    add_to_car.setAttribute("id", "item_" + item_id + "_addcar");
    add_to_car.setAttribute("style", "width: 135px; padding:1px; margin:20px; text-align: center;");
    add_to_car.setAttribute("class", "button primary icon solid fa-shopping-cart");
    textnode = document.createTextNode("加入購物車");
    //add_to_car.setAttribute("value", "加入購物車");
    add_to_car.appendChild(textnode);
    add_to_car.setAttribute("onclick", "add_to_car(this.id)");	// set add car button click event
    li.appendChild(add_to_car);

    ul.appendChild(li);

    article.appendChild(img_link);
    article.appendChild(tit);
    article.appendChild(p);
    article.appendChild(intro_text);
    article.appendChild(ul);

    parent.appendChild(article);
}

/// size btn selected ///
function select_of_size(id) {
    var split_id = id.split('_');
    /// no selete ///
    if (id_history[split_id[1]] == "") {
        for (i = 0; i < size_arr[split_id[1]].length; i++) {
            if (size_arr[split_id[1]][i] == split_id[2]) {
                size_index = i;
                break;
            }
        }

        id_history[split_id[1]] = id;
        document.getElementById(id).setAttribute("style", "background-color: rgba(255, 99, 71, 0.5); width: 50px; padding:1px; margin:10px;");
        document.getElementById("num_of_item_" + split_id[1]).textContent = "數量 : 0 / " + remaining_arr[split_id[1]][size_index] + " 金額 : $ 0";
    }
    /// seleted the same size button ///
    else if (id_history[split_id[1]] == id) {
        id_history[split_id[1]] = "";
        document.getElementById(id).setAttribute("style", "background-color: White; width: 50px; padding:1px; margin:10px;");
        document.getElementById("num_of_item_" + split_id[1]).textContent = "數量 : 0  " + " 金額 : $ 0";
        count[split_id[1]] = 0;
        total_price[split_id[1]] = 0;
    }
    /// seleted the other size button ///
    else {
        document.getElementById(id).setAttribute("style", "background-color: rgba(255, 99, 71, 0.5); width: 50px; padding:1px; margin:10px;");
        id_history[split_id[1]] = id;

        for (i = 0; i < size_arr[split_id[1]].length; i++) {
            if (size_arr[split_id[1]][i] != split_id[2]) {
                document.getElementById("item_" + split_id[1] + "_" + size_arr[split_id[1]][i]).setAttribute("style", "background-color: White; width: 50px; padding:1px; margin:10px;");
            }
            else size_index = i;
        }

        count[split_id[1]] = 0;
        total_price[split_id[1]] = 0;
        document.getElementById("num_of_item_" + split_id[1]).textContent = "數量 : 0 / " + remaining_arr[split_id[1]][size_index] + " 金額 : $ 0";
    }
}

/// plus or less for the items ///
function calc_num_of_item(id) {

    var split_id = id.split("_");

    var show_num = document.getElementById("num_of_item_" + split_id[1]).textContent;

    var price = 0;

    price = parseInt(document.getElementById("price_" + split_id[1]).textContent.replace(' ', '').split(":")[1].split(".")[1]);
    //alert(typeof (price));

    if (typeof (id_history[split_id[1]]) != "undefined") {
        if (id_history[split_id[1]] == "") return;
        if (split_id[2] == "plus") {
            if (parseInt(show_num.split(":")[1]) == remaining_arr[split_id[1]][size_index]) return;
            count[split_id[1]]++;
            total_price[split_id[1]] += price;
        }
        else {
            if (parseInt(show_num.split(":")[1]) == 0) return;
            count[split_id[1]]--;
            total_price[split_id[1]] -= price;
        }
    }
    else { return; }
    document.getElementById("num_of_item_" + split_id[1]).textContent = "數量 : " + count[split_id[1]] + " / " +
        remaining_arr[split_id[1]][size_index] + " 金額 : $ " + total_price[split_id[1]].toString();
}

/// add items to car ///
function add_to_car(id) {
    var split_id = id.split("_");
    var num_of_item_id = "num_of_item_" + split_id[1];
    var proj_id = split_id[1];		// 商品ID
    var proj_name = document.getElementById("name_" + split_id[1]).textContent;		// 商品名稱
    var proj_size = id_history[split_id[1]].split("_")[2];		// size大小
    var proj_item_price = parseInt(document.getElementById("price_" + split_id[1]).textContent.replace(' ', '').split(":")[1].split(".")[1]);
    //alert(proj_item_price);
    var proj_price = total_price[split_id[1]];	// 某item總金額
    var proj_num = parseInt(document.getElementById(num_of_item_id).textContent.split(":")[1].split(" ")[1]);	// 商品數量
    if (proj_num.toString() == "NaN" || proj_num == 0) return;


    var s = "將 " + proj_name +
        " 的 " + proj_size + " 號 " + proj_num + " 件加入購物車了 !\n金額為 : " + proj_price.toString();
    alert(s);
    var isremoved = false;
    var issame = false;

    try {
        /// search anyone item is the same ///
        for (i = 0; i < car_items; i++) {
            isremoved = false;
            for (j = 0; j < remove_arr.length; j++) {
                if (i == remove_arr[j]) {
                    //alert(i + " is removed.");
                    isremoved = true;
                    break;
                }
            }
            if (!isremoved) {
                if (proj_name.split(" ")[0] == document.getElementById("carid_" + i).textContent.toString()
                    && proj_size == document.getElementById("carsize" + i).textContent.toString()) {
                    //alert("issame");
                    issame = true;
                    document.getElementById("carnum" + i).textContent = parseInt(document.getElementById("carnum" + i).textContent.toString()) + proj_num;
                    total_price_in_car += proj_price;
                    document.getElementById("total_price_in_car").textContent = total_price_in_car;

                    var newstr = "";
                    var send_str_spl = post_str.split(",");
                    //alert(send_str_spl.length);
                    for (j = 0; j < (send_str_spl.length - 1); j++) {
                        var x_id = send_str_spl[j].split("_")[0].split(":")[1];
                        var x_size = send_str_spl[j].split("_")[2].split(":")[1];
                        var x_num = parseInt(send_str_spl[j].split("_")[4].split(":")[1]);

                        if (x_id == proj_id.toString()) {
                            if (x_size != proj_size)
                                newstr += send_str_spl[j] + ",";
                            else {
                                x_num += proj_num;
                                newstr += "id:" + proj_id + "_name:" + proj_name + "_size:" + x_size + "_" + send_str_spl[j].split("_")[3] + "_count:" + x_num + ",";
                            }
                        }
                        else newstr += send_str_spl[j] + ",";
                    }

                    post_str = newstr;
                }
            }
        }

    }
    catch { }

    if (!issame) {
        issame = false;
        var parent = document.getElementById("car_body");
        /// ID ///
        var tr = document.createElement("tr");
        tr.setAttribute("id", "caritem" + car_items.toString());

        var td_id = document.createElement("td");
        td_id.setAttribute("style", "text-align: center;");

        var id_link = document.createElement("a");
        id_link.setAttribute("id", "carid_" + car_items);
        id_link.setAttribute("href", "#img_" + split_id[1].toString());

        var textnode = document.createTextNode((parseInt(split_id[1]) + 1).toString());
        id_link.appendChild(textnode);
        td_id.appendChild(id_link);

        /// 尺寸 ///
        var td_size = document.createElement("td");
        td_size.setAttribute("id", "carsize" + car_items)
        textnode = document.createTextNode(proj_size);
        td_size.appendChild(textnode);

        /// 價錢 ///
        var td_price = document.createElement("td");
        var pric = parseInt(proj_price) / parseInt(proj_num);
        textnode = document.createTextNode(pric.toString());
        td_price.setAttribute("style", "text-align: center;");
        td_price.setAttribute("id", "carprice" + car_items);
        td_price.appendChild(textnode);

        /// 數量 ///
        var td_num = document.createElement("td");
        td_num.setAttribute("id", "carnum" + car_items);
        td_num.setAttribute("style", "text-align: center;");
        textnode = document.createTextNode(proj_num);
        td_num.appendChild(textnode);

        /// 刪除 ///
        var td_del = document.createElement("td");
        td_del.setAttribute("style", "text-align: end;");
        var del_link = document.createElement("a");
        del_link.setAttribute("style", "cursor:pointer");
        del_link.setAttribute("id", "remove_" + car_items.toString());
        del_link.setAttribute("onclick", "remove_item_in_car(this.id)");
        textnode = document.createTextNode("刪除");
        del_link.appendChild(textnode);
        td_del.appendChild(del_link);

        total_price_in_car += parseInt(proj_price);
        document.getElementById("total_price_in_car").textContent = total_price_in_car.toString();

        tr.appendChild(td_id);
        tr.appendChild(td_size);
        tr.appendChild(td_price);
        tr.appendChild(td_num);
        tr.appendChild(td_del);
        parent.appendChild(tr);

        car_items++;

        /// add info to string ///			
        post_str += "id:" + split_id[1] + "_name:" + proj_name + "_size:" + proj_size + "_price:" + proj_item_price + "_count:" + proj_num + ",";

    }

    var ismaxnum = false;
    if (proj_num == parseInt(remaining_arr[split_id[1]][size_index])) {
        ismaxnum = true;
        document.getElementById(id_history[split_id[1]]).disabled = true;
        document.getElementById(id_history[split_id[1]]).setAttribute("style", "background-color: White; width: 50px; padding:1px; margin:10px;");
        document.getElementById("num_of_item_" + split_id[1]).textContent = "數量 : " + " 0 " + " 金額 : 0";
    }
    else {
        document.getElementById(id_history[split_id[1]]).setAttribute("style", "background-color: White; width: 50px; padding:1px; margin:10px;");
        id_history[split_id[1]] = "";
    }


    remaining_arr[split_id[1]][size_index] -= count[split_id[1]];
    count[split_id[1]] = 0;
    total_price[split_id[1]] = 0;

    if (document.getElementById("send_btn").disabled)
        document.getElementById("send_btn").disabled = false;

    document.getElementById("send_str").value = post_str;

    if (!ismaxnum) {
        document.getElementById("num_of_item_" + split_id[1]).textContent = "數量 : " + " 0 / " +
            remaining_arr[split_id[1]][size_index] + " 金額 : $ " + total_price[split_id[1]].toString();
    }
}

/// remove an item ///
function remove_item_in_car(id) {
    if (confirm("確定要從待買清單中移除這項嗎？")) {
        var remove_id_spl = id.split("_")[1];       // 當前列的id

        remove_arr.push(remove_id_spl);     // 將該筆暫存資料列加入list中

        var item_size_local = document.getElementById("carsize" + remove_id_spl).textContent;   // 抓出當前列的尺寸
        var item_price_local = document.getElementById("carprice" + remove_id_spl).textContent;   // 抓出當前列的單價
        var item_num_local = document.getElementById("carnum" + remove_id_spl).textContent;   // 抓出當前列的數量

        var new_total_price = parseInt(document.getElementById("total_price_in_car").textContent) - (parseInt(item_price_local) * parseInt(item_num_local));
        total_price_in_car = new_total_price

        var item_id = parseInt(document.getElementById("carid_" + remove_id_spl).textContent) - 1;  // 抓出第幾號商品
        var index = 0;

        for (i = 0; i < size_arr[item_id].length; i++) {
            if (size_arr[item_id][i] == item_size_local) {
                index = i;
                document.getElementById("item_" + item_id + "_" + item_size_local).disabled = false;
            }
        }

        remaining_arr[item_id][index] += parseInt(item_num_local);

        total_price[item_id] = 0;
        document.getElementById("total_price_in_car").textContent = total_price_in_car;
        document.getElementById("caritem" + remove_id_spl).remove();

        var newstr = "";
        var send_str_spl = post_str.split(",");

        for (i = 0; i < (send_str_spl.length - 1); i++) {
            var x_id = send_str_spl[i].split("_")[0].split(":")[1];
            var x_size = send_str_spl[i].split("_")[2].split(":")[1];
            if (x_id == item_id) {
                if (x_size != item_size_local)
                    newstr += send_str_spl[i] + ",";
            }
            else newstr += send_str_spl[i] + ",";
        }
        id_history[item_id] = "";
        post_str = newstr;
        document.getElementById("send_str").value = post_str;
        newstr = "";
        if (car_items == remove_arr.length) document.getElementById("send_btn").disabled = true;

    }

    else { return; }
}