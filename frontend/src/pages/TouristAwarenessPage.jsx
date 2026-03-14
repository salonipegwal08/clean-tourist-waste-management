import { motion } from 'framer-motion';
import { Leaf, Info, AlertTriangle, CheckCircle, ShieldCheck, Trash2, Globe, Wind } from 'lucide-react';

const TouristAwarenessPage = () => {
  const dosAndDonts = [
    {
      title: "Do's for Tourists",
      items: [
        "Carry a reusable water bottle and shopping bag.",
        "Dispose of waste only in designated bins.",
        "Use eco-friendly and biodegradable products.",
        "Support local sustainable tourism initiatives.",
        "Respect the local flora and fauna."
      ],
      icon: <CheckCircle className="text-green-500" />,
      color: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Don'ts for Tourists",
      items: [
        "Litter or leave waste behind at tourist spots.",
        "Use single-use plastics or disposable items.",
        "Disturb wildlife or remove natural elements.",
        "Waste water or energy in hotels and resorts.",
        "Graffiti or damage historical monuments."
      ],
      icon: <AlertTriangle className="text-red-500" />,
      color: "bg-red-50 dark:bg-red-900/20"
    }
  ];

  const reductionTips = [
    {
      title: "Plastic Waste Reduction",
      description: "Simple steps to minimize your plastic footprint while traveling.",
      tips: [
        "Avoid bottled water; use filtered water stations.",
        "Say no to plastic straws and cutlery.",
        "Carry a portable, reusable container for leftovers.",
        "Choose eco-friendly accommodation that reduces plastic use."
      ],
      icon: <Trash2 className="text-primary-600" />
    },
    {
      title: "Eco-Friendly Travel",
      description: "Traveling sustainably doesn't mean sacrificing comfort.",
      tips: [
        "Use public transport, bikes, or walk whenever possible.",
        "Choose direct flights to reduce carbon emissions.",
        "Support local economies by buying locally made products.",
        "Follow the 'Leave No Trace' principle in natural areas."
      ],
      icon: <Globe className="text-secondary-600" />
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 mb-6"
          >
            <Leaf size={32} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-poppins mb-6"
          >
            Environmental <span className="gradient-text">Awareness</span>
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Empowering travelers with the knowledge and tools to preserve the natural beauty of our planet's most precious destinations.
          </p>
        </div>

        {/* Do's and Don'ts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {dosAndDonts.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`p-10 rounded-[3rem] border border-white/20 shadow-xl ${section.color}`}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold font-poppins">{section.title}</h2>
              </div>
              <ul className="space-y-6">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start space-x-4">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${idx === 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Reduction Tips Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {reductionTips.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="glass dark:bg-gray-900/80 p-10 rounded-[3rem] border border-white/20 shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/30 dark:bg-primary-900/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl inline-block shadow-sm">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-4">{card.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">{card.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {card.tips.map((tip, i) => (
                  <div key={i} className="flex items-start space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-white/20">
                    <ShieldCheck size={18} className="text-primary-600 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Educational Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl text-center"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] opacity-10" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-8">Did You Know?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="p-4 bg-white/20 rounded-2xl inline-block backdrop-blur-md">
                  <Wind size={24} />
                </div>
                <p className="text-sm font-medium">One plastic bottle takes over 450 years to decompose in nature.</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/20 rounded-2xl inline-block backdrop-blur-md">
                  <Globe size={24} />
                </div>
                <p className="text-sm font-medium">Sustainable tourism supports over 1 in 10 jobs globally.</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/20 rounded-2xl inline-block backdrop-blur-md">
                  <Info size={24} />
                </div>
                <p className="text-sm font-medium">Small actions by millions of travelers create global change.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TouristAwarenessPage;
