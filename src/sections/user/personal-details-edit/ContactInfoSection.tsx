
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/safe-icon'

interface ContactInfoSectionProps {
  contactInfo: {
    email: string
    phone: string
    alternatePhone?: string
    linkedIn?: string
    portfolio?: string
  }
  onNavigate: () => void
}

export default function ContactInfoSection({
  contactInfo,
  onNavigate,
}: ContactInfoSectionProps) {
  const contactItems = [
    {
      icon: 'Mail',
      label: 'Email',
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: 'Phone',
      label: 'Phone',
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone}`,
    },
    ...(contactInfo.alternatePhone
      ? [
          {
            icon: 'Phone',
            label: 'Alternate Phone',
            value: contactInfo.alternatePhone,
            href: `tel:${contactInfo.alternatePhone}`,
          },
        ]
      : []),
    ...(contactInfo.linkedIn
      ? [
          {
            icon: 'Linkedin',
            label: 'LinkedIn',
            value: 'View Profile',
            href: contactInfo.linkedIn,
          },
        ]
      : []),
    ...(contactInfo.portfolio
      ? [
          {
            icon: 'Globe',
            label: 'Portfolio',
            value: 'Visit Website',
            href: contactInfo.portfolio,
          },
        ]
      : []),
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Your contact details and social profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <SafeIcon name={item.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className="text-base font-semibold">{item.value}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <SafeIcon name="ExternalLink" size={18} />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Button */}
      <div className="flex gap-2">
        <Button className="flex-1" asChild>
          <Link to="/contact-info-edit">
            <SafeIcon name="Edit2" size={16} className="mr-2" />
            Edit Contact Information
          </Link>
        </Button>
      </div>
    </div>
  )
}
