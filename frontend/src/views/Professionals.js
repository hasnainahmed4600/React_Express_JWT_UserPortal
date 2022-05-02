import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom'
import axios from '../services/api'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CButton,
  CRow, CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CInputFile,
  CForm,
  CFormGroup,
  CInput,
  CFormText, CSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { useFormik } from 'formik';
import { changeUserInfo } from './Users';
import {dateConvertor} from './Users';

const Professional = () =>{
  const history = useHistory()
  const [professionalData, setProfessinalData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [status, setStatus] = useState(0)
  const [rowID, setRowID] =useState(null)
  const [rowData, setRowData] = useState([])
  const fields = ['id','picture', 'name', 'gender', 'birthday', 'email', 'comment', 'deleted', 'fk_license', 'action']
  const user_info = JSON.parse(localStorage.getItem('user_info'))
  if (user_info) {
    const ownRoles = user_info.user.roles.map(item=> item.nome)
    if (!ownRoles.includes('ROLE_PROF_EDIT')) fields.splice(-1,1)
  }

  const hanldeShowModal = () => {
    setRowID(null)
    setShowModal(!showModal)
  }

  const addOrEdit = (id, item) => {
    setRowID(id)
    item.birthday = dateConvertor(item.birthday)
    setRowData(item)
  }

  const redirect = () => {
    history.push('/login')
    localStorage.removeItem('user_info')
  }

  const deleteRow = (rowID) => {
    axios.delete('/professionals/' + rowID, {
      headers: {
        authorization: user_info.accessToken,
        token: user_info.refreshToken
      }
    }).then(res => {
      res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
      alert(res.data.message)
      handleAddNew()
    }).catch(err => {
      alert(err.message);
      redirect()
    })
  }



  useEffect( () => {
    async function getPermissions() {
      try {
        const res = await axios.get('/professionals', {
          headers: {
            authorization: user_info.accessToken,
            token: user_info.refreshToken
          }
        })
        res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
        if (res.data.professionals) {
          const val = res.data.professionals
          setProfessinalData(val)
        } else {
          alert(res.data)
            redirect()
          }
      } catch (err) {
        alert(err.message)
        redirect()
      }
    }
    getPermissions()
  }, [status])

  useEffect(() => {
    if (rowID !== null){
      setShowModal(!showModal)
    }
  }, [rowID])

  function handleAddNew() {
    setStatus(status + 1)
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol md="12">
          <CCard>
            {fields.includes('action')&& (
              <CCardHeader >
                <CRow>
                  <CCol>
                    <CButton onClick={()=>addOrEdit(-1,[])} className="px-5" color="info">+ Add New</CButton>
                    <Modal rowID={rowID} rowData = {rowData} display={showModal} api={'/professionals'} handleDisplay={hanldeShowModal}  handleAddNew={handleAddNew} />
                  </CCol>
                </CRow>
              </CCardHeader>
            )}
            <CCardBody>
              <CDataTable
                items={professionalData}
                fields={fields}
                itemsPerPageSelect
                itemsPerPage={5}
                pagination
                tableFilter
                scopedSlots = {{
                  'id' : (item, index) => (
                      <td>
                        {index + 1}
                      </td>
                  ),
                  'picture': (item) => (
                    <td>
                      <div className={'c-avatar'}>
                        <img className={'c-avatar-img'} src={item.picture} alt={''}/>
                      </div>
                    </td>
                  ),
                  'gender':
                    (item)=>(
                      <td>
                        <CBadge shape={'pill'} color={item.gender === 1? 'info' : 'success'}>
                          {item.gender === 1? "Male" : "Female"}
                        </CBadge>
                      </td>
                    ),
                  'birthday' : (item) => (
                    <td>
                      {dateConvertor(item.birthday)}
                    </td>
                  ),
                  'deleted':(item) => (
                     <td><CBadge color={item.deleted === 1? 'danger' : 'warning'}>{item.deleted === 1? 'Deleted': 'Working'}</CBadge></td>
                  ),
                  'action': (item) => (
                    <td width={102}>
                    <CRow>
                      <CCol>
                        <CButton onClick={(e)=> addOrEdit(item.id, item)} className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_edit'} name={'cilPencil'} /></CButton>
                      </CCol>
                      <CCol>
                        <CButton onClick={(e) => deleteRow(item.id)}  className={'btn-pill'} size={'sm'} ><CIcon className={'cust_action_delete'} name={'cilTrash'}/></CButton>
                      </CCol>
                    </CRow>
                    </td>
                  )
                 }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  );
}

const Modal = (props) => {
  const [mess, setMess] = useState('')
  const history = useHistory()
  const rowData = props.rowData
  function handleAddNewOne() {
    props.handleAddNew();
  }
  const handleDisplay = () => {
    setMess('')
    props.handleDisplay()
  }

  const validate = values => {
    const errors = {};
    values.name || (errors.name = 'Required');
    (!values.gender || values.gender === '0') && (errors.gender = 'Required');
    (!values.deleted || values.deleted === '0') && (errors.deleted = 'Required');
    values.birthday || (errors.birthday = 'Required');
    values.fk_license || (errors.fk_license = 'Required');
    values.fk_license || (errors.fk_license = 'Required');
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    return errors;
  }
  const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
          name: rowData.name || '',
          gender: rowData.gender || '',
          birthday: rowData.birthday || '',
          email: rowData.email || '',
          comment: rowData.comment || '',
          picture: '',
          deleted: parseInt(rowData.deleted) || '',
          fk_license: rowData.fk_license || '',
        },
        validate,
        onSubmit: values => {
          console.log(values.birthday)
          add_new(values)
        }
    })

  async function add_new(values) {
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    if (user_info.user){
      let res = null
      console.log(props.rowID)
      try {
        if (props.rowID === -1){
          res = await axios.post(`${props.api}`, values, {
            headers: {
              authorization: user_info.accessToken,
              token: user_info.refreshToken
            }
          })
        }
        if (props.rowID >= 0) {
          res = await axios.put(`${props.api}/${props.rowID}`, values, {
            headers: {
              authorization: user_info.accessToken,
              token: user_info.refreshToken
            }
          })
        }
        res.data.accessToken && changeUserInfo(res.data.accessToken, res.data.refreshToken)
        if (res.data.message === "Success"){
          handleAddNewOne();
          handleDisplay()
        } else {
          setMess(res.data.message)
        }
      } catch (e) {
        alert(e.message)
        history.push('/login')
        localStorage.removeItem('user_info')
      }
    }

  }

  return (
    <>
      <CModal
        show={props.display}
        onClose={(e)=>handleDisplay()}
        size="lg"
        color={'info'}
      >
        <CModalHeader closeButton>New Professional</CModalHeader>
        <CModalBody>
          <CForm>
              <CFormGroup>
                <CRow>
                  <CCol>
                    <CInput id="name" name="name" placeholder="Name" value={formik.values.name} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.name?formik.errors.name:null}</p>
                  </CCol>
                  <CCol>
                    <CSelect custom name="gender" id="gender" value={formik.values.gender} onChange={formik.handleChange}>
                      <option value="0">Select gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </CSelect>
                    <p className="text-warning" >{formik.errors.gender?formik.errors.gender:null}</p>
                  </CCol>
                  <CCol>
                    <CInput id="email" name="email" type="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange}/>
                    <p className="text-warning" >{formik.errors.email?formik.errors.email:null}</p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CInput id="birthday" name="birthday" type={'date'} placeholder="Birthday" value={formik.values.birthday} onChange={formik.handleChange} />
                    <p className="text-warning" >{formik.errors.birthday?formik.errors.birthday:null}</p>
                  </CCol>
                  <CCol>
                    <CInput id="comment" name="comment" placeholder="Comment" value={formik.values.comment} onChange={formik.handleChange}/>
                  </CCol>
                  <CCol>
                    <CInput id="fk_license" name="fk_license" placeholder="Fk License" value={formik.values.fk_license} onChange={formik.handleChange}/>
                    <p className="text-warning" >{formik.errors.fk_license?formik.errors.fk_license:null}</p>
                  </CCol>

                </CRow>
                <CRow>
                  <CCol>
                    <CSelect custom name={'deleted'} id={'deleted'} value={formik.values.deleted} onChange={formik.handleChange}>
                      <option value="0">Select status</option>
                      <option value="1">Deleted</option>
                      <option value="2">Working</option>
                    </CSelect>
                    <p className="text-warning" >{formik.errors.deleted?formik.errors.deleted:null}</p>
                  </CCol>
                  <CCol>
                    <CInputFile id="picture" name="picture" value={formik.values.picture} onChange={formik.handleChange}/>
                  </CCol>
                  <CCol></CCol>
                </CRow>
                <CFormText className="help-block" color={'danger'}>{mess}</CFormText>
              </CFormGroup>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton onClick={formik.handleSubmit} type="submit" color="info">Submit</CButton>{' '}
          <CButton
            color="secondary"
            onClick={(e) => handleDisplay()}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Professional
