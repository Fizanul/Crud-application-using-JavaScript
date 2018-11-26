var editMode = false;
var resArr = [];

var contact = { 
    list : function (category) {

        var html = `<table>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
        </tr>`;
    
    
        ajax('GET', '/contact/list')
            .then((res) => {
                resArr = JSON.parse(res);
                if (resArr.length == 0) {
                    html = "Welcome to Contacts! To add a contact, click the New contact button.";
                } 
                else {
                    var contactList = [];
                    if(category){
                        contactList = resArr.filter(item => {
                            return item.categories === category;
                        });
                    } else {
                        contactList = resArr;
                    }
                    for (var j = 0; j < contactList.length; j++) {
                        html += `<tr id="row_${contactList[j]._id}" ><td>${contactList[j].name}</td><td>${contactList[j].email}</td>
                <td><button class="edit" onclick="contact.edit('${contactList[j]._id}')">Edit</button><button class="remove" onclick="contact.remove('${contactList[j]._id}')">Delete</button></tr>`
                    }
                    html += '</table>';
                }
                document.getElementById("contactList").innerHTML = html;
            })
            .catch(function (error) {
                contact.notification("Something Went wrong", true);
            });
    
    },
    new : function (){
        document.getElementById("contactList").setAttribute("hidden", true);
        document.getElementById("contactForm").removeAttribute("hidden");
    },
    save : function () {
        console.log('asd');
        var contactForm = document.getElementById("contactForm");
        if (contactForm.checkValidity()) {
            document.getElementById("contactForm").setAttribute("hidden", true);
            document.getElementById("contactList").removeAttribute("hidden");
            var data = {};
            var elements = contactForm.elements;
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].getAttribute("id") != "submit") {
                    data[elements[i].getAttribute("id")] = elements[i].value;
                }
            }
            if (editMode) {
                var id = contactForm.getAttribute('contact');
                contact.update(id, data);
            } else {
               contact.add(data);
            }
        }     
    },
    add:function(data) {
    
        ajax('POST', '/contact/add', data)
            .then((f) => {
                contact.notification("Your contact has been saved.");
                contact.list();
                contactForm.reset();
            })
            .catch(function (error) {
                contact.notification("Something Wrong", true);
            });
    },
    update: function (id, data) {
    
        ajax('PUT', '/contact/update/' + id, data)
            .then((f) => {
                contact.list();
                contactForm.reset();   
                editMode = false;
                contactForm.removeAttribute("contact");
                contact.notification("Your contact has been modified.")
            })
            .catch(function (error) {
                contact.notification("Something Wrong", true);
            });
    },
    edit : function (id) {
        document.getElementById("contactList").setAttribute("hidden", true);
        document.getElementById("contactForm").removeAttribute("hidden");
        var y = document.getElementById('row_' + id);
        var contactForm = document.getElementById("contactForm");
    
        ajax('GET', '/contact/edit/' + id)
            .then((f) => {
                data = JSON.parse(f);
                var elements = contactForm.elements;
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].getAttribute("id") != "submit") {
                        elements[i].value = data[elements[i].getAttribute("id")];
                    }
                }
                editMode = true;
                contactForm.setAttribute('contact', data._id);
            })
            .catch(function (error) {
                contact.notification("Something Wrong", true);
            });
    },
    remove: function (id) {
        var x = document.getElementById('row_' + id);
    
        ajax('DELETE', '/contact/remove/' + id)
            .then((f) => {
                contact.notification("Your contact has been deleted.");
                contact.list();
            })
            .catch(function (error) {
                contact.notification("Something Wrong", true);
            });
    },
    notification : function (message, error) {
        var notification = document.getElementById("notification");
        notification.innerHTML = message;
        notification.removeAttribute("hidden");
        setTimeout(() => {
            notification.setAttribute("hidden", true);
        }, 5000);
        if (error) {
            notification.style.backgroundColor = "red";
        } else {
            notification.style.backgroundColor = "green";
        }
    }
 };

function ajax(method, url, data = "") {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.open(method, url, true);
        if (method != 'DELETE') {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(JSON.stringify(data));
    });
}

contact.list();