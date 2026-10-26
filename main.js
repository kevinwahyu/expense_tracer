/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
let transactions = [];
let editEnable = false;
let selectedTransactionId = null;

// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()
function generateId() {
  return +new Date();
}

function generateTransaction(id, title, amount, date, type) {
  return {
    id,
    title,
    amount,
    date,
    type,
  };
}

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM
/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("transactionForm");

  // Form Submit
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (editEnable) {
      editTransactionItem();
    } else {
      addTransaction();
    }
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addTransaction() {
  const title = document.getElementById("transactionFormTitleInput").value;
  const amount = Number(
    document.getElementById("transactionFormAmountInput").value,
  );
  const date = document.getElementById("transactionFormDateInput").value;
  const type = document.getElementById("transactionFormTypeSelect").value;
  const id = generateId();

  if (title === "") {
    alert("judul tidak boleh kosong ya");
    return;
  }
  if (amount < 1) {
    alert("Nominal tidak boleh kurang dari 1 ya");
    return;
  }

  const box = generateTransaction(id, title, amount, date, type);

  transactions.push(box);
  document.dispatchEvent(new Event("transaction:updated"));
}

/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

const STORAGE_KEY = "TRACER_APP";

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const transaction of data) {
      transactions.push(transaction);
    }
  }

  document.dispatchEvent(new Event("transaction:updated"));
}

function editTransaction(itemId) {
  const transactionFormItem = findTransaction(itemId);
  if (transactionFormItem !== null) {
    editEnable = true;
    selectedTransactionId = transactionFormItem.id;
    const title = (document.getElementById("transactionFormTitleInput").value =
      transactionFormItem.title);
    const amount = (document.getElementById(
      "transactionFormAmountInput",
    ).value = transactionFormItem.amount);
    const date = (document.getElementById("transactionFormDateInput").value =
      transactionFormItem.date);
    const type = (document.getElementById("transactionFormTypeSelect").value =
      transactionFormItem.type);
    const buttonSubmit = document.querySelector(".tracker-form__submit");
    buttonSubmit.innerText = "Edit";
  }
}

function editTransactionItem() {
  if (selectedTransactionId !== null) {
    const transactionFormItem = findTransaction(selectedTransactionId);
    if (transactionFormItem.id === selectedTransactionId) {
      const title = document.getElementById("transactionFormTitleInput").value;
      const amount = Number(
        document.getElementById("transactionFormAmountInput").value,
      );
      const date = document.getElementById("transactionFormDateInput").value;
      const type = document.getElementById("transactionFormTypeSelect").value;

      if (title === "") {
        alert("Judul tidak boleh kosong ya");
        return;
      }

      if (amount < 1) {
        alert("Nominal tidak boleh kurang dari 1 ya");
        return;
      }

      transactionFormItem.title = title;
      transactionFormItem.amount = amount;
      transactionFormItem.date = date;
      transactionFormItem.type = type;
      resetTransactionForm();
      document.dispatchEvent(new Event("transaction:updated"));
    }
  }
}

function resetTransactionForm() {
  document.getElementById("transactionForm").reset();
  const buttonSubmit = document.querySelector(".tracker-form__submit");
  buttonSubmit.innerText = "Simpan";
  editEnable = false;
  selectedTransactionId = null;
}

document.addEventListener("transaction:updated", function () {
  saveData();
  renderTransactions(transactions);
});

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */

function findTransactionIndex(itemId) {
  for (const index in transactions) {
    if (transactions[index].id === itemId) {
      return index;
    }
  }
  return -1;
}

function findTransaction(itemId) {
  for (const item of transactions) {
    if (item.id === itemId) {
      return item;
    }
  }
  return null;
}

function removeTransaction(itemId) {
  const transactionTarget = findTransactionIndex(itemId);
  if (transactionTarget === -1) return;
  transactions.splice(transactionTarget, 1);
  document.dispatchEvent(new Event("transaction:updated"));
}

function editTypeTransaction(itemId) {
  const transactionTarget = findTransaction(itemId);
  if (transactionTarget === null) return;
  if (transactionTarget.type === "income") {
    transactionTarget.type = "expense";
  } else {
    transactionTarget.type = "income";
  }
  document.dispatchEvent(new Event("transaction:updated"));
}

// SearchLogic
const searchInput = document.getElementById("searchTransactionFormTitleInput");
const searchForm = document.getElementById("searchTransactionForm");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
});
searchInput.addEventListener("input", function () {
  const filteredTransactions = [];
  const keyword = searchInput.value.toLowerCase();

  for (const item of transactions) {
    if (item.title.toLowerCase().includes(keyword)) {
      filteredTransactions.push(item);
    }
  }
  renderTransactions(filteredTransactions);
});

function renderTransactions(data) {
  const income = document.getElementById("incomeList");
  income.innerHTML = "";
  const expense = document.getElementById("expenseList");
  expense.innerHTML = "";

  const saldoBox = document.querySelector(".tracker-summary__balance-amount");
  const incomeBox = document.querySelector(
    ".tracker-summary__stat-amount--income",
  );
  const expenseBox = document.querySelector(
    ".tracker-summary__stat-amount--expense",
  );
  let incomeTotal = 0;
  let expenseTotal = 0;

  for (const Item of data) {
    // Title
    const teksNama = document.createElement("h3");
    teksNama.innerText = Item.title;
    teksNama.setAttribute("data-testid", "transactionItemTitle");
    teksNama.classList.add("tracker-transaction-item__title");

    // Amount
    const teksNominal = document.createElement("p");
    teksNominal.innerText = "Nominal: Rp" + Item.amount;
    teksNominal.setAttribute("data-testid", "transactionItemAmount");
    teksNominal.classList.add("tracker-transaction-item__amount");

    // Date
    const teksTanggal = document.createElement("p");
    teksTanggal.innerText = "Tanggal: " + Item.date;
    teksTanggal.setAttribute("data-testid", "transactionItemDate");
    teksTanggal.classList.add("tracker-transaction-item__date");

    // Type
    const teksTipe = document.createElement("p");
    teksTipe.innerText =
      "Tipe: " + (Item.type === "income" ? "Pemasukan" : "Pengeluaran");
    teksTipe.setAttribute("data-testid", "transactionItemType");
    teksTipe.classList.add("tracker-transaction-item__detail");

    // Button
    const containerButton = document.createElement("div");
    containerButton.classList.add("tracker-transaction-item__actions");
    containerButton.classList.add("tracker-transaction-item__right");

    const editTypeButton = document.createElement("button");
    editTypeButton.setAttribute("data-testid", "transactionItemEditTypeButton");
    editTypeButton.classList.add("tracker-transaction-item__btn");
    editTypeButton.innerText = "Ubah Tipe";
    editTypeButton.addEventListener("click", function () {
      editTypeTransaction(Item.id);
    });
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "transactionItemDeleteButton");
    deleteButton.classList.add("tracker-transaction-item__btn");
    deleteButton.innerText = "Hapus";
    deleteButton.addEventListener("click", function () {
      removeTransaction(Item.id);
    });
    const editButton = document.createElement("button");
    editButton.classList.add("tracker-transaction-item__btn");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", function () {
      editTransaction(Item.id);
    });
    containerButton.append(editButton, editTypeButton, deleteButton);

    // Container
    const container = document.createElement("div");
    container.setAttribute("data-testid", "transactionItem");
    container.classList.add("tracker-transaction-item");

    container.append(
      teksNama,
      teksNominal,
      teksTanggal,
      teksTipe,
      containerButton,
    );

    if (Item.type === "income") {
      income.append(container);
      teksNominal.classList.add("tracker-transaction-item__amount--income");
      incomeTotal += Item.amount;
    } else {
      expense.append(container);
      teksNominal.classList.add("tracker-transaction-item__amount--expense");
      expenseTotal += Item.amount;
    }
  }

  const saldo = incomeTotal - expenseTotal;

  saldoBox.innerText = "Rp " + saldo;
  incomeBox.innerText = "Rp " + incomeTotal;
  expenseBox.innerText = "Rp " + expenseTotal;
}
