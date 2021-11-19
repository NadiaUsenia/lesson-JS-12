import {getCookie} from './js/getCookie.js'
import {setCookie} from './js/setCookie.js'
console.log(setCookie, getCookie);

console.log(setCookie, getCookie)
function closeModal() {
  const modalWindow = document.querySelector('.modal-wrapper');
  modalWindow.remove();
}

class User {
  constructor({id, name, email, adress, phone}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.adress = adress;
    this.phone = phone;
  }

  edit({name = this.name, email = this.email, adress = this.adress, phone = this.phone}) {
    this.name = name;
    this.email = email;
    this.adress = adress;
    this.phone = phone;
}

  get() {
    return {
      id: this.id,
      name: this.name, 
      email: this.email,
      adress: this.adress, 
      phone: this.phone, 
  }
  }
}

class Contacts {
  constructor(name) {
      this.contactsList = [];
  }
  add (name, email, address, phone) {
      const id = this.contactsList.length + 1;
      const contact = new User({id, name, email, address, phone});
      this.contactsList.push(contact);
     
      
  }
  editContact (data) {
      const { name, id, email, address, phone } = data
      this.contactsList[id - 1].name = name;
      this.contactsList[id - 1].email = email;
      this.contactsList[id - 1].address = address;
      this.contactsList[id - 1].phone = phone;
      
  }

  remove(id) {
      delete this.contactsList[id - 1];
  }

  get () {
      return this.contactsList;
  }
}

class ContactsApp extends Contacts {
    constructor() {
      super();
  }

    get contactListMethod() {
      return this.contactsList;
  }

    set contactListMethod(newContactsList) {
      this.contactsList = newContactsList;
  }

  get localContacts() {
    const jsonContacts = localStorage.getItem('contacts');
    return JSON.parse(jsonContacts);
  }
  set localContacts (contactsList) {
    const cookie = getCookie('contacts');
    console.log(cookie);
    if(!cookie) {
      setCookie('contacts', true);
    }
    const jsonContacts = JSON.stringify(contactsList);
    localStorage.setItem('contacts', jsonContacts);
  }

  getData () {
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then((json) => {
        this.contactsList = json;
        this.draw();
    });
}
  //создаем кнопки удаления

  createEditDeleteBtn(id) {

    const openModal = () => {
      document.body.insertAdjacentHTML('beforeend', `
      <div class="modal-wrapper">
        <div class="modal-box">
          <span class="close">x</span>
          <h1>Редактировать контакт</h1>
        </div>
      </div>
      `)
    
    const contentBox = document.querySelector('.modal-box');
    const nameInput = document.createElement('input');
    const emailInput = document.createElement('textarea');
    const adressInput = document.createElement('textarea');
    const phoneInput = document.createElement('textarea');
    const save = document.createElement('button');
    save.innerText = 'Save';

   save.addEventListener('click', () => {
       this.editUser({id: id, name: nameInput.value, email: emailInput.value, adress: adressInput.value, phone: phoneInput.value});
       closeModal();
       this.draw();
   })

   contentBox.appendChild(nameInput);
   contentBox.appendChild(emailInput);
   contentBox.appendChild(adressInput);
   contentBox.appendChild(phoneInput);
   contentBox.appendChild(save);
    
    
    const close = document.querySelector('.close');
    close.addEventListener('click', closeModal);
  }

    // this.editUser({id});
    // this.removeUser(id);
    const nodeElement = document.createElement('div');
        const btnEdit = document.createElement('button');
        const btnRemove = document.createElement('button');
        
        btnEdit.innerText = 'Редактировать';
        btnRemove.innerText = 'Удалить'; 
        
    
      btnRemove.addEventListener('click', () => {
      this.remove(id);
      this.draw();
    })

    btnEdit.addEventListener('click', openModal);
    nodeElement.appendChild(btnEdit);
    nodeElement.appendChild(btnRemove);
    
    return nodeElement;

  }

  draw() {
    this.localContacts = this.contactsList;
    const oldList = document.getElementById('contactList');
    if (oldList) {
        oldList.remove();
    }
    const contactList = document.createElement('ul');
    contactList.id = 'contactList';
    this.contactsList.map((contact) => {
      if (contact) {
        const li = document.createElement('li');
        const nameNode = document.createElement('h2');
        nameNode.innerText = contact.name;
        const emailNode = document.createElement('p');
        emailNode.innerText = contact.email;
        const adressNode = document.createElement('p');
        adressNode.innerText = contact.adress;
        const phoneNode = document.createElement('p');
        phoneNode.innerText = contact.phone;
        
        li.appendChild(nameNode);
        li.appendChild(emailNode);
        li.appendChild(adressNode);
        li.appendChild(phoneNode);
        contactList.appendChild(li);
        const btns = this.createEditDeleteBtn(contact.id)
        li.appendChild(btns);
        // this.draw();
      }

    });
    document.body.appendChild(contactList);
}

  init() {

    const form = document.createElement('form');

    const inputName = document.createElement('input');
    inputName.placeholder = 'Ваше имя..';
    inputName.type = 'text';
    inputName.setAttribute('name', 'name');
    const inputEmail = document.createElement('input');
    inputEmail.placeholder = 'Ваш email..';
    inputEmail.setAttribute('name', 'email');
    const inputAdress = document.createElement('input');
    inputAdress.placeholder = 'Ваш адрес..';
    inputAdress.setAttribute('name', 'adress');
    const inputPhone = document.createElement('input');
    inputPhone.placeholder = 'Ваш телефон..';
    inputPhone.setAttribute('name', 'phone');

    const addBtn = document.createElement('button');
    addBtn.innerText = 'Отправить';
    addBtn.classList.add('add');

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Сохранить';
    saveBtn.classList.add('save');
    form.appendChild(inputName);
    form.appendChild(inputEmail);
    form.appendChild(inputAdress);
    form.appendChild(inputPhone);
    form.appendChild(addBtn);
    form.appendChild(saveBtn);
    form.appendChild(addBtn);
   
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = event.currentTarget[0].value;
      event.currentTarget[0].value = '';
      const email = event.currentTarget[1].value;
      event.currentTarget[1].value = '';
      const adress = event.currentTarget[2].value;
      event.currentTarget[2].value = '';
      const phone = event.currentTarget[3].value;
      event.currentTarget[3].value = '';
    this.add(name, email, adress, phone);
    console.log(name, email, adress, phone);
      this.draw();
    } )

    document.body.appendChild(form);

    if(!localStorage.getItem('contactList')) {
      this.getData();
      this.localContacts = contactsList;
  } else {
      this.contactsList = this.localContacts;
      this.draw();
  }
   
  } 
}

const user = new User('Alex', 'alex@mail.ru', 'Minsk', '+375 29 999 99 99');
const contactsApp = new ContactsApp();
contactsApp.init();
console.log(contactsApp);

// contactsApp.createUser({name: 'Nadia',})
// contactsApp.storage =['Juli'];
// console.log(contactsApp.usersList);
//contactsList.createUser('Alex', 'alex@mail.ru', 'Minsk', '+375 29 999 99 99');
//contactsList.createUser('Bob', 'bob@mail.ru', 'Minsk', '+375 29 999 45 ');
//contactsList.createUser('Make', 'make@mail.ru', 'Minsk', '+375 29 999 99 56');
//contactsList.editUser(0, 'Liza');
//contactsList.removeUser(1);
//contactsList.createUser('Nik', 'nik@mail.ru', 'Minsk', '+375 29 999 99 22');

