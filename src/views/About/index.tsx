export default function AboutPage() {
  return <div className={'p-4'}>
    <div className={'font-bold text-xl'}>
      Hide My History
    </div>
    <div className={''}>
      Author: <a href={'https://delimister.com'} className={'underline'} target={'_blank'}>@MonokaiJs</a>
    </div>
    <div className={'mt-2'}>
      <p>
        I wrote this in my toilet time watching some movies... Well, that is it.
      </p>
      <p>
        If you like this and it helps you in any mean, no need to say thank you, 1 BTC would be much appreciated, lol.
      </p>
    </div>
    <div className={'mt-4'}>
      Want to contribute? <a href={'https://github.com/monokaijs/hide-my-history'} className={'underline'}>Source code.</a>
    </div>
  </div>
}