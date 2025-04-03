import Modal from "react-modal";
import robot from '../assets/robot.png';

const ModalDelete = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="flex justify-center items-center min-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)", 
        },
      }}
    >
      <div className="bg-black p-6 rounded-lg text-white w-120 shadow-xl">
        <div className="flex items-center gap-4">
          <img src={robot} alt="Robot" className="max-w-[180px] max-h-[200px] flex-shrink-0" />
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-text-right">
            ¿DESEAS ELIMINAR ESTE USUARIO?
            </h2>
            <div className="flex gap-4 mt-6">
           
              <button
                className="w-[110px] py-2 bg-gradient-to-b from-black to-[#0170b8] text-white border border-white rounded-lg"
                onClick={onConfirm}
              >
                Aceptar
              </button>
              <button
                className="w-[110px] py-2 bg-gradient-to-b from-black to-[#0170b8] text-white border border-white rounded-lg"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDelete;
