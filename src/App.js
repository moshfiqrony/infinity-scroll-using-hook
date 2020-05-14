import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const observer = useRef();
  const lastUserRef = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          console.log("I am setting new page number");
          setPageNumber(prevPageNumber => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://randomuser.me/api/?page=${pageNumber}&results=10&seed=abc&inc=email,name`
      )
      .then(res => {
        setTimeout(() => {
          console.log("I am setting new users");
          // compare here that is any more data left?
          setUsers(prevUser => [...prevUser, ...res.data.results]);
          setLoading(false);
        }, 2000);
      });
  }, [pageNumber]);

  return (
    <div className="App">
      {users.map((user, index) => {
        if (users.length === index + 1) {
          return (
            <div key={index} className="card m-2 p-4 w-50 mx-auto">
              <div ref={lastUserRef}>
                <p className="p-0 m-0">
                  {user.name.first} {user.name.last}
                </p>
                <p>{user.email}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className="card m-2 p-4 w-50 mx-auto">
              <div>
                <p className="p-0 m-0">
                  {user.name.first} {user.name.last}
                </p>
                <p>{user.email}</p>
              </div>
            </div>
          );
        }
      })}
      {loading && (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}
