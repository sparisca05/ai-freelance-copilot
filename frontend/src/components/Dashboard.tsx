import { useState } from 'react'
import { fetchWithAuth } from '../api'

type DashboardProps = {
email: string | null | undefined
error: string
onSignOut: () => void
onOpenProfile: () => void
}

type GeneratedProposal = {
proposal_id: string
proposal: string
}

function Dashboard({ email, error, onSignOut, onOpenProfile }: DashboardProps) {
const [jobTitle, setJobTitle] = useState('')
const [jobDescription, setJobDescription] = useState('')
const [isGenerating, setIsGenerating] = useState(false)
const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(null)
const [fetchError, setFetchError] = useState('')
const [proposalHistory, setProposalHistory] = useState<GeneratedProposal[]>([])
const [showHistory, setShowHistory] = useState(false)

const handleGenerateProposal = async (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault()
	
	if (!jobDescription.trim()) {
		setFetchError('Please enter a job description')
		return
	}

	try {
		setIsGenerating(true)
		setFetchError('')
		
		const savedJob = await fetchWithAuth('/save_job', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: jobTitle, description: jobDescription }),
		})

		const result = await fetchWithAuth('/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ job_id: savedJob.job_id }),
		})

		const proposal: GeneratedProposal = {
			proposal_id: result.id,
			proposal: result.proposal_text,
		}
		
		setGeneratedProposal(proposal)
		setProposalHistory([proposal, ...proposalHistory])
		setJobDescription('')
		console.log('Proposal generated successfully:', proposal)
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : 'Failed to generate proposal'
		console.error('Error generating proposal:', errorMsg)
		setFetchError(errorMsg)
	} finally {
		setIsGenerating(false)
	}
}

return (
	<main className="auth-page" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
	<div style={{ margin: '0 auto', display: 'grid', gap: '2rem' }}>
		{/* Header */}
		<section className="card" style={{ padding: '1.5rem', justifySelf: 'center' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
				<div>
					<h1 style={{ margin: '0 0 0.5rem 0' }}>Proposal Generator</h1>
					<p className="subtle">Welcome, {email}</p>
					<p className="subtle">Create AI-powered proposals for freelance opportunities</p>
				</div>
			</div>
		<button 
			type="button"
			onClick={onOpenProfile}
			style={{
				width: 'auto',
				padding: '0.5rem 1rem',
				marginRight: '0.5rem',
				fontSize: '0.9rem',
				border: '1px solid #ddd',
				borderRadius: '8px',
				backgroundColor: '#fff',
				cursor: 'pointer',
			}}
		>
			Profile
		</button>
		<button 
			className="button" 
			onClick={onSignOut}
			type="button"
			style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
		>
			Sign out
		</button>
		</section>

		{/* Errors */}
		{error && <p className="status error" style={{ marginBottom: '1rem', textAlign: 'left' }}>{error}</p>}
		{fetchError && <p className="status error" style={{ marginBottom: '1rem', textAlign: 'left' }}>{fetchError}</p>}
		
		<section style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem' }}>
			{/* Input Form */}
			<section className="card" style={{ padding: '1.5rem' }}>
			<h2 style={{ margin: '0 0 1rem 0', textAlign: 'left' }}>New Proposal</h2>
			<form onSubmit={handleGenerateProposal} className="auth-form">
				<label htmlFor="jobTitle">Job Title</label>
				<input
				type="text"
				id="jobTitle"
				value={jobTitle}
				onChange={(e) => setJobTitle(e.target.value)}
				placeholder="Enter the job title..."
				style={{
					border: '1px solid #c4c4c4',
					borderRadius: '8px',
					padding: '0.75rem',
					fontSize: '1rem',
					fontFamily: 'inherit',
				}}
				required
				/>
				<label htmlFor="jobDescription">Description</label>
				<textarea
				id="jobDescription"
				value={jobDescription}
				onChange={(e) => setJobDescription(e.target.value)}
				placeholder="Paste the job description or requirements here..."
				minLength={10}
				rows={6}
				style={{
					border: '1px solid #c4c4c4',
					borderRadius: '8px',
					padding: '0.75rem',
					fontSize: '1rem',
					fontFamily: 'inherit',
					resize: 'vertical',
				}}
				required
				/>
				<button 
				className="button" 
				type="submit" 
				disabled={isGenerating}
				style={{ marginTop: '1rem' }}
				>
				{isGenerating ? 'Generating proposal...' : 'Generate Proposal'}
				</button>
			</form>
			</section>

			{/* Generated Proposal */}
			{generatedProposal && (
			<section className="card" style={{ padding: '1.5rem' }}>
				<h2 style={{ margin: '0 0 1rem 0', textAlign: 'left' }}>Generated Proposal</h2>
				<div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#666' }}>
				<p>ID: {generatedProposal.proposal_id}</p>
				</div>
				<div
				style={{
					backgroundColor: '#f5f5f5',
					border: '1px solid #e0e0e0',
					borderRadius: '8px',
					padding: '1rem',
					maxHeight: '400px',
					overflow: 'auto',
					whiteSpace: 'pre-wrap',
					wordWrap: 'break-word',
					fontSize: '0.9rem',
					lineHeight: '1.6',
					textAlign: 'left',
				}}
				>
				{generatedProposal.proposal}
				</div>
				<button
				style={{
					marginTop: '1rem',
					padding: '0.5rem 1rem',
					backgroundColor: '#fff',
					border: '1px solid #ddd',
					borderRadius: '4px',
					cursor: 'pointer',
					fontSize: '0.9rem',
				}}
				>
				Copy to Clipboard
				</button>
			</section>
			)}
		</section>

		{/* History Toggle */}
		{proposalHistory.length > 0 && (
		<section className="card" style={{ padding: '1.5rem' }}>
			<button
			onClick={() => setShowHistory(!showHistory)}
			style={{
				width: '100%',
				backgroundColor: '#f5f5f5',
				border: '1px solid #ddd',
				padding: '1rem',
				borderRadius: '8px',
				cursor: 'pointer',
				fontSize: '1rem',
				fontWeight: '600',
				textAlign: 'center',
			}}
			>
			{showHistory ? 'Hide' : 'Show'} Proposal History ({proposalHistory.length})
			</button>

			{showHistory && (
			<div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
				{proposalHistory.map((prop, idx) => (
				<div
					key={idx}
					style={{
					border: '1px solid #ddd',
					borderRadius: '8px',
					padding: '1rem',
					backgroundColor: '#fafafa',
					}}
				>
					<p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
					ID: {prop.proposal_id}
					</p>
					<p style={{ margin: '0', fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'left' }}>
					{prop.proposal.substring(0, 200)}...
					</p>
				</div>
				))}
			</div>
			)}
		</section>
		)}
	</div>
	</main>
)
}

export default Dashboard
