import '../styles/components/BackButton.css'

function BackButton({ onClick, src = "/assets/backBtn.svg" }) {
  return (
    <button type="button" className="backButton" onClick={onClick}>
      <img src={src} width="24" height="24" />
    </button>
  );
}

export default BackButton
