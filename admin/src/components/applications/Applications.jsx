import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
// import { userColumns, userRows } from "../../datatablesource";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'
import Swal from 'sweetalert2'

const Applications = () => {
    const [status, setStatus] = useState('')
    const [err, setErr] = useState(false);
  const [data, setData] = useState([]);
  const userColumns = [ { field: "_id", headerName: "ID", width: 200 }, {
    field: "userId",
    headerName: "User id",
    width: 150,
  }, {
    field: "desc",
    headerName: "Description",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Created on",
    width: 115,
  }]
  useEffect(() => {
     axios.get(`posts/`,{withCredentials:true}).then((res)=>{
      // console.log(res);
      // console.log(res.data);
      const posts = res.data
      setData(posts)
     }).catch((err) => {
      localStorage.removeItem("user");
        setErr(err.response.data)
  
    })
    //  setData(['Id'])
  }, [status])

function handleDelete(item){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`posts/${item}`,{withCredentials:true}).then((response) => {
        //  console.log(response);
          if (response.data) {
              // console.log(response);
              setStatus(new Date())
          } else {
              setErr('Something went wrong')
          }
      }).catch((err) => {
        localStorage.removeItem("user");
          setErr(err.response.data)
    
      })
    }
  })
  
}
  const actionColumn = [
    {
      field: "image",
      headerName: "Image",
      width: 130,
      renderCell: (params) => {
        // console.log(params,"params apps");
        return (
         <img className="image" src={params.row.img} alt="no image" />
        );
      },
    },
    {
      field: "likes",
      headerName: "Likes",
      width: 100,
      renderCell: (params) => {
        // console.log(params,"params apps");
        return (
         <span>{params.row.likes.length}</span>
        );
      },
    },
    {
      field: "comments",
      headerName: "Comments",
      width: 100,
      renderCell: (params) => {
        // console.log(params.row.comments.length,"params apps");
        return (
         <span>{params.row.comments.length}</span>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        // console.log(params,"params apps");
        return (
         
          <div className="cellAction">
          
            <div className="deleteButton" onClick={()=>{handleDelete(params.id)}}>Delete</div>
           
          </div>
        );
      },
    }
  ];
  return (
    <div className="datatable">
       {err && <div className="p-4 mb-4 text-sm text-center text-red-800 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert" 
       onClick={()=>{window.location.replace('/login')}} style={{cursor:"pointer"}}> {err} click here to re-login</div>}
      <div className="datatableTitle">
    Posts
        
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId ={(row) => row._id}
        rowHeight={65}
      />
    </div>
  );
};

export default Applications;
