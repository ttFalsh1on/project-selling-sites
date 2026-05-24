import { useQuery } from 'convex/react'

import { motion } from 'framer-motion'

import { api } from '../../convex/_generated/api'

import { EditableBlock } from '../components/cms/EditableBlock'

import { EditableReviewCard } from '../components/cms/EditableReviewCard'

import { EditableServiceCard } from '../components/cms/EditableServiceCard'

import { GlassCard } from '../components/GlassCard'

import { LoadingState } from '../components/LoadingState'

import { useCmsPage } from '../hooks/useCmsPage'



export function HomePage() {

  const services = useQuery(api.services.list)

  const reviews = useQuery(api.reviews.list)

  const cms = useCmsPage('home')



  if (services === undefined || reviews === undefined || cms.isLoading) {

    return <LoadingState />

  }



  const btnServices = cms.getButton('home.hero.btnServices')

  const btnReviews = cms.getButton('home.hero.btnReviews')

  const servicesLink = cms.getButton('home.services.link')



  return (

    <div className="space-y-6 sm:space-y-8">

      <GlassCard className="relative overflow-hidden text-center">

        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-400/10" />

        <div className="relative space-y-4 py-6 sm:space-y-6 sm:py-8 md:py-10">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <EditableBlock

              page="home"

              cmsKey="home.hero.tagline"

              type="text"

              value={cms.getText('home.hero.tagline')}

              className="text-xs font-semibold uppercase tracking-widest text-cyan-400 sm:text-sm"

              as="p"

            />

          </motion.div>

          <h1 className="font-nunito text-2xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">

            <EditableBlock

              page="home"

              cmsKey="home.hero.title"

              type="text"

              value={cms.getText('home.hero.title')}

              as="span"

            />{' '}

            <EditableBlock

              page="home"

              cmsKey="home.hero.titleHighlight"

              type="text"

              value={cms.getText('home.hero.titleHighlight')}

              className="bg-gradient-to-r from-accent-purple to-accent-teal bg-clip-text text-transparent"

              as="span"

            />

          </h1>

          <EditableBlock

            page="home"

            cmsKey="home.hero.description"

            type="text"

            value={cms.getText('home.hero.description')}

            className="mx-auto max-w-2xl px-1 text-sm text-white/60 sm:text-base"

            as="p"

          />

          <div className="flex flex-col items-stretch justify-center gap-3 px-2 sm:flex-row sm:items-center sm:px-0">

            <EditableBlock

              page="home"

              cmsKey="home.hero.btnServices"

              type="button"

              value={btnServices.label}

              href={btnServices.href}

              className="btn-primary w-full sm:w-auto"

            />

            <EditableBlock

              page="home"

              cmsKey="home.hero.btnReviews"

              type="button"

              value={btnReviews.label}

              href={btnReviews.href}

              className="btn-secondary w-full sm:w-auto"

            />

          </div>

        </div>

      </GlassCard>



      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-4">

        {[0, 1, 2].map((i) => (

          <GlassCard key={i} delay={i * 0.1} className="text-center">

            <EditableBlock

              page="home"

              cmsKey={`home.stat.${i}.value`}

              type="text"

              value={cms.getText(`home.stat.${i}.value`)}

              className="neon-logo text-2xl font-bold sm:text-3xl"

              as="p"

            />

            <EditableBlock

              page="home"

              cmsKey={`home.stat.${i}.label`}

              type="text"

              value={cms.getText(`home.stat.${i}.label`)}

              className="mt-1 text-xs text-white/50 sm:text-sm"

              as="p"

            />

          </GlassCard>

        ))}

      </div>



      <div>

        <EditableBlock

          page="home"

          cmsKey="home.services.title"

          type="text"

          value={cms.getText('home.services.title')}

          className="mb-3 text-lg font-bold text-white sm:mb-4 sm:text-xl"

          as="h2"

        />

        <div className="grid gap-4 sm:grid-cols-2">

          {services.slice(0, 2).map((service, i) => (

            <EditableServiceCard key={service._id} service={service} delay={i * 0.1} compact />

          ))}

        </div>

        <div className="mt-4 text-center">

          <EditableBlock

            page="home"

            cmsKey="home.services.link"

            type="button"

            value={servicesLink.label}

            href={servicesLink.href}

            className="btn-secondary w-full sm:w-auto"

          />

        </div>

      </div>



      {reviews[0] && (

        <div>

          <EditableBlock

            page="home"

            cmsKey="home.review.title"

            type="text"

            value={cms.getText('home.review.title')}

            className="mb-3 text-lg font-bold text-white sm:mb-4 sm:text-xl"

            as="h2"

          />

          <EditableReviewCard review={reviews[0]} compact />

        </div>

      )}

    </div>

  )

}


