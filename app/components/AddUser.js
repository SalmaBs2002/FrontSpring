"use client";
import React, { Fragment, useState ,useEffect} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import UserList from './UserList';

const AddUser = () => {
  const USER_API_BASE_URL = "http://localhost:8080/api/v1/users";
  const DEPARTMENTS_API_BASE_URL = "http://localhost:8080/api/v1/departments";
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ id: "", firstName: "", lastName: "", emailId: "",departement: "" });
  const [responseUser, setresponseUser] = useState({ id: "", firstName: "", lastName: "", emailId: "",departement: ""  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(DEPARTMENTS_API_BASE_URL);
        const fetchedDepartments = await response.json();
        setDepartments(fetchedDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  }

  const saveUser = async () => {
    try {
      // Validation of email
      if (!user.emailId.endsWith("@enicar-ucar.tn")) {
        throw new Error("Invalid email address. Please enter a valid email ending with @enicar-ucar.tn");
      }
  
      const response = await fetch(USER_API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      
      if (!response.ok) {
        // If response is not successful, throw an error
        const errorMessage = await response.text(); // Extract error message from response body
        throw new Error(errorMessage || "Something went wrong");
      }
      
      const _user = await response.json();
      setresponseUser(_user);
      closeModal();
      reset();
    } catch (error) {
      console.error("Error saving user:", error.message);
      alert("Error saving user: " + error.message);
    }
  }

  const reset = (e) => {
    if (e) {
      e.preventDefault(); // Only call preventDefault if the event object is provided
    }
    setUser({
      id: "", firstName: "", lastName: "", emailId: "",departement: "" ,
    });
    setIsOpen(false);
  };
  

  return (
    <>
      <div className='container mx-auto my-8'>
        <div className='h-12'>
          <button onClick={openModal} className='rounded bg-slate-600 text-white px-6 py-2 font-semibold'>Add User</button>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md'>
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Add new User</Dialog.Title>
                <div className='flex max-w-md max-auto'>
                  <div className='py-2'>
                    <div className='h-14 my-4'>
                      <label className='block text-gray-600 text-sm font-normal'>First Name</label>
                      <input type='text' name='firstName' className='h-10 w-96 border mt-2 px-2 py-2' value={user.firstName} onChange={handleChange}></input>
                    </div>
                    <div className='h-14 my-4'>
                      <label className='block text-gray-600 text-sm font-normal'>Last Name</label>
                      <input type='text' name='lastName' className='h-10 w-96 border mt-2 px-2 py-2' value={user.lastName} onChange={handleChange}></input>
                    </div>
                    <div className='h-14 my-4'>
                      <label className='block text-gray-600 text-sm font-normal'>Email id</label>
                      <input type='text' name='emailId' className='h-10 w-96 border mt-2 px-2 py-2' value={user.emailId} onChange={handleChange}></input>
                    </div>
                    <div className='h-14 my-4'>
                      <label className='block text-gray-600 text-sm font-normal'>Departement</label>
                      <select name='departement' className='h-10 w-96 border mt-2 px-2 py-2' value={user.departement} onChange={handleChange}>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className='h-14 my-4 space-x-4 pt-4'>
                      <button onClick={saveUser} className='rounded text-white font-semibold bg-green-400 hover:bg-green-700 py-2 px-6'>Save</button>
                      <button onClick={reset} className='rounded text-white font-semibold bg-red-400 hover:bg-red-700 py-2 px-6'>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <UserList user={responseUser}/>
    </>
  )
}

export default AddUser;
