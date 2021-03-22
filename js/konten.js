const totalView = document.querySelector('#total');
let arrayPesanan = [];
const listPesanan = document.querySelector('#listPesanan');
const PESANAN_KEY = "PESANAN_KEY";
let id = 1;
    
function add(menu, selector, harga){
    let input = document.querySelector(selector);
        
    let objekPesanan = {
        id: `pesanan-${id}`,
        nama: menu,
        jumlah: Number(input.value),
        hargaTotal: Number(harga*input.value) 
    };
    
    let pesananBeda = true;
    for (let i = 0; i < arrayPesanan.length; i++) {
        if(arrayPesanan[i].nama === objekPesanan.nama){
            arrayPesanan[i].jumlah = arrayPesanan[i].jumlah + objekPesanan.jumlah;
            arrayPesanan[i].hargaTotal = arrayPesanan[i].hargaTotal + objekPesanan.hargaTotal;
            const list = document.querySelector(`#${arrayPesanan[i].id}`);
            list.innerText = `${arrayPesanan[i].jumlah} ${arrayPesanan[i].nama}`;
            pesananBeda = false;
            break;
        }
    }
        
    if (pesananBeda && objekPesanan.jumlah>0){
        let li = `<li class="list-group-item" id="${objekPesanan.id}">${objekPesanan.jumlah} ${objekPesanan.nama}</li>`;
        listPesanan.insertAdjacentHTML('afterbegin', li);
        arrayPesanan.push(objekPesanan);
        id++;
    }
    
    hitungTotal();
}
    
function hitungTotal(){
    let totalHarga = 0;
    for (let i = 0; i < arrayPesanan.length; i++) {
        totalHarga = totalHarga + arrayPesanan[i].hargaTotal;
        totalView.value = totalHarga;
    }
    return totalHarga;
}
    
function reset(){
    totalView.innerHTML = 0;
    location.reload();
}