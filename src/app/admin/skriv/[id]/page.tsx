import { redirect } from 'next/navigation'

export default function EditPostRedirect({ params }: { params: { id: string } }) {
  redirect(`/studio/structure/post;${params.id}`)
}
