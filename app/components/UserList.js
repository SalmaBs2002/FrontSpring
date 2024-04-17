"use client";

import { useEffect, useState } from "react";
import User from "./User";
import EditUser from "./EditUser";

const UserList = ({user})=> {
  const USER_API_BASE_URL = "http://localhost:8080/api/v1/users";
  const DEPARTMENTS_API_BASE_URL = "http://localhost:8080/api/v1/departments";
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setuserId] = useState(null);
  const [responseUser, setresponseUser]= useState(null);
  const [departments, setDepartments] = useState([]);
  
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(USER_API_BASE_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const fetchedUsers = await response.json();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [user,responseUser]);

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
     
  const deleteUser = (e,id) => {
    e.preventDefault();
    fetch(USER_API_BASE_URL + "/" + id , {
      method : "DELETE",
    }).then ((response) => {
      if(users){
        setUsers((prevElement)=>{
          return prevElement.filter((user) => user.id != id);
        });
      }
    });
  }

  const editUser = (e,id) => {
    e.preventDefault();
    setuserId(id);
  };

  return (
    <>
    <div className="container mx-auto my-8">
      <div className="flex shadow border-b">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-gray-500 uppercase tracking-wide py-3 px-6">First Name</th>
              <th className="text-left font-medium text-gray-500 uppercase tracking-wide py-3 px-6">Last Name</th>
              <th className="text-left font-medium text-gray-500 uppercase tracking-wide py-3 px-6">Email Id</th>
              <th className="text-left font-medium text-gray-500 uppercase tracking-wide py-3 px-6">Departement</th>
              <th className="text-left font-medium text-gray-500 uppercase tracking-wide py-3 px-6">Actions</th>
            </tr>
          </thead>
          {!loading && users && users.length > 0 && (
            <tbody className="bg-white">
              {users.map((user) => (
                <User key={user.id} user={user} deleteUser={deleteUser} editUser={editUser}/>
                
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
    <EditUser userId ={userId} setresponseUser={setresponseUser} departments={departments}/>
    </>
  );
};

export default UserList;