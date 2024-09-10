import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
//npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons sweetalert2

// Datos iniciales de clientes
const data = [
  { id: 1, Nombre: "Carolina Guzman", Document: 16514416, Correo: "guzman@gmail.com", Celular: "3546549", Nejemplares: 5 },
  { id: 2, Nombre: "Andra Torres", Document: 18761919, Correo: "torres@gmail.com", Celular: "3546549", Nejemplares: 2 },
  { id: 3, Nombre: "Natalia Muriel", Document: 1016177143, Correo: "muriel@gmail.com", Celular: "3546549", Nejemplares: 1 }
];

class Clientes extends React.Component {
  state = {
    data: data,
    filteredData: data,
    form: {
      id: '',
      Nombre: '',
      Document: '',
      Correo: '',
      Celular: '',
      Nejemplares: ''
    },
    modalAñadir: false,
    modalEditar: false,
    searchText: '',
    emailError: '',
    documentError: '',
    nameError: ''
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      }
    });
  }

  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredData: this.state.data.filter(item =>
        item.Nombre.toLowerCase().includes(searchText) ||
        item.Document.toString().includes(searchText) ||
        item.Correo.toLowerCase().includes(searchText) ||
        item.Celular.toString().includes(searchText)
      )
    });
  }

  mostrarmodalAñadir = () => {
    this.setState({
      modalAñadir: true,
      emailError: '',
      documentError: '',
      nameError: '',
      form: {
        id: '',
        Nombre: '',
        Document: '',
        Correo: '',
        Celular: '',
        Nejemplares: ''
      }
    });
  }

  ocultarmodalAñadir = () => {
    this.setState({ modalAñadir: false });
  }

  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: registro, emailError: '', documentError: '', nameError: '' });
  }

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  }

  validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateName = name => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  }

  documentExists = document => {
    return this.state.data.some(item => item.Document === document);
  }

  Añadir = () => {
    const { Nombre, Document, Correo, Celular, Nejemplares } = this.state.form;

    // Validar campos obligatorios
    if (!Nombre || !Document || !Correo || !Celular || !Nejemplares) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    // Validar nombre
    if (!this.validateName(Nombre)) {
      this.setState({ nameError: 'El nombre no puede contener números.' });
      return;
    }

    // Validar correo electrónico
    if (!this.validateEmail(Correo)) {
      this.setState({ emailError: 'El correo electrónico no es válido.' });
      return;
    }

    // Validar documento
    if (this.documentExists(parseInt(Document))) {
      this.setState({ documentError: 'El documento ya existe.' });
      return;
    }

    const valorNuevo = { ...this.state.form, id: this.state.data.length + 1 };
    const lista = [...this.state.data, valorNuevo];
    this.setState({ data: lista, filteredData: lista, modalAñadir: false });
    Swal.fire('Éxito', 'Cliente registrado exitosamente.', 'success');
  }

  editar = (dato) => {
    // Validar campos obligatorios
    if (!dato.Nombre || !dato.Document || !dato.Correo || !dato.Celular || !dato.Nejemplares) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    // Validar nombre
    if (!this.validateName(dato.Nombre)) {
      this.setState({ nameError: 'El nombre no puede contener números.' });
      return;
    }

    // Validar correo electrónico
    if (!this.validateEmail(dato.Correo)) {
      this.setState({ emailError: 'El correo electrónico no es válido.' });
      return;
    }

    // Validar documento
    const existingDocument = this.state.data.find(item => item.Document === dato.Document && item.id !== dato.id);
    if (existingDocument) {
      this.setState({ documentError: 'El documento ya existe.' });
      return;
    }

    const lista = this.state.data.map(registro =>
      registro.id === dato.id ? { ...dato } : registro
    );
    this.setState({ data: lista, filteredData: lista, modalEditar: false });
    Swal.fire('Éxito', 'Cliente actualizado exitosamente.', 'success');
  }

  eliminar = (dato) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Realmente deseas eliminar el registro ${dato.id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const lista = this.state.data.filter(registro => registro.id !== dato.id);
        this.setState({ data: lista, filteredData: lista });
        Swal.fire('Eliminado', 'Cliente eliminado exitosamente.', 'success');
      }
    });
  }

  render() {
    const { form, modalAñadir, modalEditar, emailError, documentError, nameError } = this.state;

    return (
      <>
        <Container>
          <p></p>
          <div className="d-flex justify-content-between mb-3">
          <Input
              type="text"
              placeholder="Buscar"
              value={this.state.searchText}
              onChange={this.handleSearch}
              style={{ width: '300px' }}
            />
            <Button color="success" onClick={this.mostrarmodalAñadir}>Añadir cliente</Button>
          </div>

          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Correo</th>
                <th>Celular</th>
                <th>Nejemplares</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredData.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.Nombre}</td>
                  <td>{elemento.Document}</td>
                  <td>{elemento.Correo}</td>
                  <td>{elemento.Celular}</td>
                  <td>{elemento.Nejemplares}</td>
                  <td>
                    <Button color="dark" onClick={() => this.mostrarModalEditar(elemento)}>
                      <FontAwesomeIcon icon={faEdit} size="sm" className="btn-sm" />
                    </Button>{' '}
                    <Button color="danger" onClick={() => this.eliminar(elemento)}>
                      <FontAwesomeIcon icon={faTrash} size="sm" className="btn-sm" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        {/* Modal para añadir un nuevo cliente */}
        <Modal isOpen={modalAñadir}>
          <ModalHeader>
            <div>
              <h3>Añadir cliente</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input className="form-control" name="Nombre" type="text" onChange={this.handleChange} />
              <small className="text-danger">{nameError}</small>
            </FormGroup>

            <FormGroup>
              <label>Documento:</label>
              <input className="form-control" name="Document" type="text" onChange={this.handleChange} />
              <small className="text-danger">{documentError}</small>
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input className="form-control" name="Correo" type="text" onChange={this.handleChange} />
              <small className="text-danger">{emailError}</small>
            </FormGroup>

            <FormGroup>
              <label>Celular:</label>
              <input className="form-control" name="Celular" type="text" onChange={this.handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Nejemplares:</label>
              <input className="form-control" name="Nejemplares" type="number" onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={this.Añadir}>Añadir</Button>
            <Button color="secondary" onClick={this.ocultarmodalAñadir}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal para editar un cliente */}
        <Modal isOpen={modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar cliente</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="Nombre"
                type="text"
                value={form.Nombre}
                onChange={this.handleChange}
              />
              <small className="text-danger">{nameError}</small>
            </FormGroup>

            <FormGroup>
              <label>Documento:</label>
              <input
                className="form-control"
                name="Document"
                type="text"
                value={form.Document}
                onChange={this.handleChange}
              />
              <small className="text-danger">{documentError}</small>
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input
                className="form-control"
                name="Correo"
                type="text"
                value={form.Correo}
                onChange={this.handleChange}
              />
              <small className="text-danger">{emailError}</small>
            </FormGroup>

            <FormGroup>
              <label>Celular:</label>
              <input
                className="form-control"
                name="Celular"
                type="text"
                value={form.Celular}
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Nejemplares:</label>
              <input
                className="form-control"
                name="Nejemplares"
                type="number"
                value={form.Nejemplares}
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => this.editar(form)}>Actualizar</Button>
            <Button color="secondary" onClick={this.ocultarModalEditar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default Clientes;
