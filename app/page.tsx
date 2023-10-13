import dynamic from 'next/dynamic'

const ReactApp = dynamic(() => import('./components/reactApp'), {
  ssr: false,
})


export default function Home() {
    return (<ReactApp />);
}
