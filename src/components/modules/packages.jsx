import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, Form } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import alimentacion from '../../assets/alimentacion.jpeg';
import pesebrera from '../../assets/pesebrera.jpg';
import veterinaria from '../../assets/veterinaria.avif';

const initialServices = [
  { id: 1, nombre: "Servicio Pesebrera", descripcion: "Alojamiento del ejemplar", imagen: pesebrera, estado: false },
  { id: 2, nombre: "Servicio Alimentación", descripcion: "Alimentación al ejemplar las veces son correspondidas", imagen: alimentacion, estado: true },
  { id: 3, nombre: "Servicio Veterinaria", descripcion: "Cuidado médico al ejemplar las veces que asi o requiera", imagen: veterinaria, estado: true }
];

class Packages extends React.Component {
  state = {
    services: initialServices,
    allServices: initialServices,
    searchTerm: '',
    form: {
      id: '',
      nombre: '',
      descripcion: '',
      imagen: '',
      estado: true,
      imagenFile: null,
      selectedServices: [], // Servicios seleccionados para el paquete
    },
    modalAñadir: false,
    modalEditar: false,
    currentPage: 1,
    servicesPerPage: 3,
  };

  mostrarModalAñadir = () => {
    this.setState({
      modalAñadir: true,
      form: { id: '', nombre: '', descripcion: '', imagen: '', estado: true, imagenFile: null, selectedServices: [] }
    });
  };

  ocultarModalAñadir = () => {
    this.setState({ modalAñadir: false });
  };

  mostrarModalEditar = (service) => {
    this.setState({ modalEditar: true, form: { ...service, imagenFile: null } });
  };

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false });
  };

  handleChange = (e) => {
    const { name, value, type, files } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: type === 'file' ? files[0] : value
      }
    });
  };

  handleSelectService = (id) => {
    this.setState(prevState => {
      const selectedServices = [...prevState.form.selectedServices];
      if (selectedServices.includes(id)) {
        return { form: { ...prevState.form, selectedServices: selectedServices.filter(serviceId => serviceId !== id) } };
      } else {
        return { form: { ...prevState.form, selectedServices: [...selectedServices, id] } };
      }
    });
  };

  handleImageUpload = (callback) => {
    const { imagenFile } = this.state.form;
    if (imagenFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState(
          {
            form: {
              ...this.state.form,
              imagen: reader.result
            }
          },
          () => {
            if (callback) callback();
          }
        );
      };
      reader.readAsDataURL(imagenFile);
    } else {
      if (callback) callback();
    }
  };

  añadirServicio = () => {
    try {
      const { nombre, descripcion, selectedServices } = this.state.form;

      if (nombre.trim() === '' || descripcion.trim() === '') {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, ingrese todos los campos.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      const regex = /^[A-Za-z][A-Za-z0-9\s]*$/;
      if (!regex.test(nombre)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El nombre del paquete no puede comenzar con un número ni contener caracteres especiales.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      if (selectedServices.length === 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, seleccione al menos un servicio.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      const servicioExistente = this.state.services.find(servicio => servicio.nombre.toLowerCase() === nombre.toLowerCase());
      if (servicioExistente) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El paquete ya existe. Por favor, ingrese un nombre de paquete diferente.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      this.handleImageUpload(() => {
        const nuevoServicio = { 
          ...this.state.form,
          id: this.state.services.length + 1,
          descripcion: descripcion.split('\n'),
          selectedServices: selectedServices.map(id => this.state.allServices.find(service => service.id === id))
        };
        const lista = [...this.state.services, nuevoServicio];
        this.setState({ services: lista, modalAñadir: false });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Paquete agregado exitosamente",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al añadir el paquete: ${error.message}`,
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
    }
  };

  editarServicio = () => {
    try {
      const { nombre, descripcion } = this.state.form;

      const regex = /^[A-Za-z][A-Za-z0-9\s]*$/;
      if (!regex.test(nombre)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "El nombre del servicio no puede comenzar con un número ni contener caracteres especiales.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      if (nombre.trim() === '' || descripcion.trim() === '') {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor, ingrese todos los campos.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      const servicioExistente = this.state.services.find(servicio =>
        servicio.nombre.toLowerCase() === nombre.toLowerCase() && servicio.id !== this.state.form.id
      );
      if (servicioExistente) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El servicio ya existe. Por favor, ingrese un nombre de servicio diferente.",
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
        return;
      }

      this.handleImageUpload(() => {
        const lista = this.state.services.map((s) =>
          s.id === this.state.form.id ? this.state.form : s
        );
        this.setState({ services: lista, modalEditar: false });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Servicio actualizado exitosamente",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error al actualizar el servicio: ${error.message}`,
        customClass: {
          confirmButton: 'custom-swal'
        }
      });
    }
  };

  eliminarServicio = (service) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar',
      confirmButtonText: 'Sí, eliminar',
      reverseButtons: true,
      customClass: {
        cancelButton: 'custom-swal',
        confirmButton: 'custom-swal'
      },
      didOpen: (modal) => {
        const icon = modal.querySelector('.swal2-icon.swal2-warning');
        if (icon) {
          icon.style.color = '#f1c40f';
          icon.style.borderColor = '#f1c40f';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const lista = this.state.services.filter((s) => s.id !== service.id);
        this.setState({ services: lista });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Servicio eliminado exitosamente",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            confirmButton: 'custom-swal'
          }
        });
      }
    });
  };

  cambiarEstado = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esto cambiará el estado del servicio!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar',
      confirmButtonText: 'Sí, cambiar',
      reverseButtons: true,
      customClass: {
        cancelButton: 'custom-swal',
        confirmButton: 'custom-swal'
      },
      didOpen: (modal) => {
        const icon = modal.querySelector('.swal2-icon.swal2-warning');
        if (icon) {
          icon.style.color = '#f1c40f';
          icon.style.borderColor = '#f1c40f';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const lista = this.state.services.map((service) =>
            service.id === id ? { ...service, estado: !service.estado } : service
          );
          this.setState({ services: lista });

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Estado cambiado exitosamente',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              confirmButton: 'custom-swal'
            }
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cambiar el estado del servicio',
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            customClass: {
              confirmButton: 'custom-swal'
            }
          });
        }
      }
    });
  };

  handleClickPage = (event, pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { services, searchTerm, form, modalAñadir, modalEditar, currentPage, servicesPerPage, allServices } = this.state;

    const filteredServices = services.filter(service =>
      service.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    const renderServices = currentServices.map((service) => (
      <div className="card m-3" style={{ width: '23rem', height: '33-rem', display: 'flex', flexDirection: 'column' }} key={service.id}>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: '1', padding: '1rem' }}>
          <h5 className="card-title">{service.nombre}</h5>
          <p className="card-text" style={{ 
            height: '7rem', 
            border: '1px solid #ccc', 
            padding: '0.5rem', 
            overflowY: 'auto', 
            marginBottom: '1rem'
          }}>
            {service.descripcion}
          </p>
          <div className="d-flex justify-content-between align-items-center" style={{ marginTop: 'auto' }}>
            <FormGroup style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '0.2rem', borderRadius: '0.2rem', marginBottom: '0.5rem', flex: '1' }}>
              <Input
                type="text"
                value={service.estado ? "Activo" : "Inactivo"}
                disabled
                style={{ textAlign: 'start', border: 'none', backgroundColor: 'transparent', fontWeight: 'bold', fontSize: '0.8rem' }}
              />
            </FormGroup>
            <div className="d-flex align-items-center" style={{ marginLeft: '1rem' }}>
              <Button
                color={service.estado ? "secondary" : "success"}
                onClick={() => this.cambiarEstado(service.id)}
                style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}
              >
                {service.estado ? "Off" : "On"}
              </Button>
              <Button
                color="dark"
                onClick={() => this.mostrarModalEditar(service)}
                style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                color="danger"
                onClick={() => this.eliminarServicio(service)}
                style={{ fontSize: '0.75rem' }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <Container>
        <div className="row mb-4">
            <p></p>
          <div className="col-md-6 mb-3">
            <Input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={this.handleSearchChange}
              style={{ marginBottom: '1rem' }}
            />
          </div>
          <div className="col-md-6 mb-3 text-end">
            <Button color="success" onClick={this.mostrarModalAñadir}>Añadir Paquete</Button>
          </div>
        </div>

        <div className="d-flex justify-content-center flex-wrap">
          {renderServices}
        </div>

        <div className="d-flex justify-content-center mt-3">
          <Stack spacing={2}>
            <Pagination count={Math.ceil(filteredServices.length / servicesPerPage)} page={currentPage} onChange={this.handleClickPage} />
          </Stack>
        </div>

        {/* Modal Añadir */}
        <Modal isOpen={modalAñadir} toggle={this.ocultarModalAñadir}>
          <ModalHeader toggle={this.ocultarModalAñadir}>Añadir Paquete</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input type="text" name="nombre" placeholder="Nombre del Paquete" value={form.nombre} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="descripcion" placeholder="Descripción del Paquete" value={form.descripcion} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="file" name="imagenFile" onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <h5>Servicios Disponibles</h5>
              {allServices.map(service => (
                <div key={service.id} className="form-check">
                  <Input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={form.selectedServices.includes(service.id)}
                    onChange={() => this.handleSelectService(service.id)}
                  />
                  <label htmlFor={`service-${service.id}`} className="form-check-label">
                    {service.nombre}
                  </label>
                </div>
              ))}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.añadirServicio}>Añadir</Button>
            <Button color="danger" onClick={this.ocultarModalAñadir}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {/* Modal Editar */}
        <Modal isOpen={modalEditar} toggle={this.ocultarModalEditar}>
          <ModalHeader toggle={this.ocultarModalEditar}>Editar Servicio</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type="file" name="imagenFile" onChange={this.handleChange} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.editarServicio}>Guardar cambios</Button>
            <Button color="danger" onClick={this.ocultarModalEditar}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default Packages;
