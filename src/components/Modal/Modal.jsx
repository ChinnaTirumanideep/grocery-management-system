function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="secondary-btn" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
