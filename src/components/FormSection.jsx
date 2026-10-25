import '../styles/components/FormSection.css'

// 라벨(+ 보조 문구) 아래에 입력 요소를 두는 폼 묶음. hint 는 라벨 옆, desc 는 아래 안내문.
function FormSection({ label, hint, desc, as: Tag = 'div', className = '', children }) {
  return (
    <Tag className={`formSection ${className}`}>
      {label && (
        <div className="formSectionLabel">
          {label}
          {hint && <small>· {hint}</small>}
        </div>
      )}
      {children}
      {desc && <p className="formSectionDesc">{desc}</p>}
    </Tag>
  )
}

export default FormSection
