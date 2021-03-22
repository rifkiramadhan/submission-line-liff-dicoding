let nama = "";
let daftar = "";
window.onload = function() {
    const defaultLiffId = "1655537307-EzqkJXxx";   // change the default LIFF value if you are not using a node server
    
    // DO NOT CHANGE THIS
    let myLiffId = "";

    myLiffId = defaultLiffId;
    initializeLiff(myLiffId);
};

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            console.log(err);
        });
};
 
/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    //cek apakah aplikasi dibuka di browser line
    const lineProfile = document.getElementById('profile');
    if(liff.isInClient()){
        addProfile();
        document.getElementById('liffLogoutButton').setAttribute('hidden', '');
    //cek apakah aplikasi dibuka di external browser dan status login 
    } else if(liff.isLoggedIn()){
        addProfile();
        document.getElementById('openWindowButton').setAttribute('hidden', '');
        document.getElementById('liffLogoutButton').removeAttribute('hidden');
    } else {
    //kondisi ketika aplikasi dibuka di external browser dan status belum login
        document.getElementById('app').innerHTML = '';
        //Menambahkan loginPage di awal halaman jika belum login
        document.getElementById('loginPage').innerHTML = /*html*/`
        <div class="jumbotron jumbotron-fluid">
            <div class="container text-center p-2">
                <h1 class="display-4">Warung Terbang</h1>
                <p class="lead">Menerima pesan antar dengan GoFood</p>
                <button class="btn btn-success" id="liffLoginButton"><i class="fas fa-sign-in-alt"></i> Masuk</button>
            </div>
        </div>`;
        document.getElementById('openWindowButton').setAttribute('hidden', '');
        document.getElementById('liffLogoutButton').setAttribute('hidden', '');
        document.getElementById('sendMessageButton').setAttribute('hidden', '');
    };
    registerButtonHandlers();
    console.log("Client : " + liff.isInClient());
    console.log("Login : " + liff.isLoggedIn());
};

function addProfile(){
    //mendapatkan profil pengguna
    const lineProfile = document.getElementById('profile');
    liff.getProfile()
    .then(profile => {
      nama = profile.displayName;
      const picture = profile.pictureUrl;
      lineProfile.innerHTML = `<img src="${picture}" alt="Foto Profil Line" class="w-50 rounded-circle d-block mx-auto my-2">
                               <p class="text-center">Selamat Datang <b>${nama}</b>, Silahkan pesan menu makanan atau minuman anda!</p>`;
      })
    .catch((err) => {
      console.log('error', err);
    });
};

function getPesanan(){
    for (let i = 0; i < arrayPesanan.length; i++) {
        daftar = daftar + `${i+1}) ${arrayPesanan[i].jumlah} ${arrayPesanan[i].nama} \n`;
    };
};

function registerButtonHandlers() {
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: 'https://warung-terbang.herokuapp.com/', // Isi dengan Endpoint URL aplikasi web Anda
            external: true
        });
    });

    if (!liff.isLoggedIn()) {
        document.getElementById('liffLoginButton').addEventListener('click', function() {
            liff.login();
        });
    };

    document.getElementById('closeAppButton').addEventListener('click', function() {
        liff.closeWindow();
    });

    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        };
    });

    document.getElementById('sendMessageButton').addEventListener('click', function() {
        let totalHarga = hitungTotal();
        getPesanan();
        if (!liff.isInClient()) {
            alert(`
                  Hai ${nama} !\nPesanan Anda :\n${daftar}\nTotal Rp. ${totalHarga}\nSilahkan pesan malaui chat pada aplikasi LINE`);
        } else {
            liff.sendMessages([{
                'type': 'text',
                'text': `Halo ${nama} !\n\nPesanan Anda :\n${daftar}\nTotal Harga : Rp. ${totalHarga}\n\nTerima kasih telah memesan di aplikasi Restaurant Warung Terbang. Mohon bersabar, pesanan anda akan segera disiapkan dan diantar.`
            }]).then(function() {
                liff.closeWindow();
            }).catch(function(error) {
                window.alert('Gagal mengirim pesan: ' + error);
            });
        }
    });
};