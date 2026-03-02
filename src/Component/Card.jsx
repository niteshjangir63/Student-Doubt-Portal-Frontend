import "./Card.css";
import { Link,useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Loader from "./Loader";

export default function Card({ title, subtitle, status,deleteloader, children, footer ,doubtId,handleDelete,role}) {

 


  return (
    <div className="card">
     
     {status == "pending" && doubtId && role == "student"  && <Link to={`/edit/${doubtId}`}> <i className="fa-solid fa-pencil"></i></Link>}
     {doubtId &&  role == "student" && <button onClick={()=>handleDelete(doubtId)} className="deleteBtn">{deleteloader ? <Loader/>:<i className="fa-solid fa-trash"></i> }</button>}
     
      <div className="card-header">
        <h3>{title}</h3>
        {status && (
          <span className={`card-status ${status}`}>
            {status}
          </span>
        )}
      </div>

      {subtitle && <p className="card-subtitle">{subtitle}</p>}

      <div className="card-body">
        {children}
      </div>

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}