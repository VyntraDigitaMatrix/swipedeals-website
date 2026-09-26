import { useEffect, useState } from 'react'
import { FileCheck, FileText, Plus, RefreshCw, Trash2, Upload, X } from 'lucide-react'
import Button from '../buttons/Button'
import Dropdown from '../forms/Dropdown'
import { useVehicleDocuments } from '../../hooks/useVehicleDocuments'
import { DOCUMENT_TYPES } from '../../services/vehicleListingService'

export default function VehicleDocumentsManager({ slug, onClose }) {
  const { documents, loading, fetchDocuments, uploadDocument, replaceDocument, deleteDocument } = useVehicleDocuments(slug)
  const [selectedType, setSelectedType] = useState('RC')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchDocuments()
    }
  }, [slug, fetchDocuments])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Please select a document file to upload.')
      return
    }
    setUploading(true)
    try {
      const existing = documents.find((doc) => doc.documentType === selectedType)
      if (existing) {
        await replaceDocument(selectedType, selectedFile)
      } else {
        await uploadDocument(selectedType, selectedFile)
      }
      setSelectedFile(null)
      alert(`Document (${selectedType}) uploaded successfully!`)
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to upload vehicle document.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (docId, docType) => {
    if (!window.confirm(`Are you sure you want to delete this ${docType} document?`)) return
    try {
      await deleteDocument(docId)
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Failed to delete vehicle document.')
    }
  }

  const content = (
    <div className={onClose ? "max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8" : "w-full space-y-6"}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-text">Vehicle Verification Documents</h2>
          <p className="mt-1 text-xs text-text-secondary">Upload RC, Insurance, PUC, and other official records to boost buyer trust.</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-text-secondary hover:bg-surface-alt">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Upload Document Form */}
      <form onSubmit={handleUpload} className="rounded-2xl border border-border bg-surface-alt/60 p-5">
        <h3 className="mb-3 text-sm font-bold text-text">Upload or Replace Document</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Dropdown
            label="Document Type"
            value={selectedType}
            onChange={(v) => setSelectedType(v)}
            options={DOCUMENT_TYPES}
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-text-secondary">Select Document File</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" size="sm" icon={Upload} disabled={uploading || !selectedFile} type="submit">
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </form>

      {/* Existing Documents List */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-text">Uploaded Documents ({documents.length})</h3>
        {loading ? (
          <p className="py-8 text-center text-xs text-text-secondary">Loading vehicle documents...</p>
        ) : documents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-text-light">
            <FileText size={32} className="mx-auto mb-2 text-text-light/60" />
            No vehicle documents uploaded yet. Upload your RC or Insurance to get verified faster!
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const label = DOCUMENT_TYPES.find((d) => d.value === doc.documentType)?.label || doc.documentType
              return (
                <div key={doc.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">{label}</p>
                      <p className="text-xs text-text-secondary">
                        {doc.originalFileName || 'Document File'} {doc.fileSize ? `(${Math.round(doc.fileSize / 1024)} KB)` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.documentUrl && (
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface-alt"
                      >
                        View File
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, label)}
                      className="rounded-lg p-2 text-danger hover:bg-danger/10"
                      title="Delete Document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {onClose && (
        <div className="mt-8 flex justify-end border-t border-border pt-4">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      )}
    </div>
  )

  if (onClose) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}
