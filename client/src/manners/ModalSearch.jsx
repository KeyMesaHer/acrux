import { useState } from "react";
import Modal from "react-modal";
import { FiSearch } from "react-icons/fi";

const ModalSearch = ({ isOpen, onClose, onSearch }) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchClick = () => {
    onSearch(searchInput);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="flex justify-center items-center min-h-screen"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{
        overlay: { backgroundColor: "rgb(255, 255, 255, 0.5)" },
      }}>
      <div className="bg-blue p-4 rounded-lg shadow-lg w-full max-w-md sm:w-96 mx-4">
        <div className=" bg-white flex items-center border border-gray-300 rounded-full p-2">
          <input
            type="text"
            placeholder="Buscar Usuario..."
            className="w-full p-2 text-gray-700 outline-none bg-white rounded-full"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            onClick={handleSearchClick}
            className="text-gray-700 px-3 hover:text-blue-600 transition"
          >
            <FiSearch size={24} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSearch;
