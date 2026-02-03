
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/safe-icon'

export default function PhotoRequirements() {
  const requirements = [
    {
      icon: 'Dimensions',
      title: 'Dimensions',
      description: 'Minimum 400x400 pixels, recommended 800x800 pixels',
    },
    {
      icon: 'FileSize',
      title: 'File Size',
      description: 'Maximum 5MB for optimal upload speed',
    },
    {
      icon: 'Image',
      title: 'Format',
      description: 'JPG, PNG, or WebP formats supported',
    },
    {
      icon: 'Smile',
      title: 'Photo Quality',
      description: 'Clear, well-lit photo with your face visible',
    },
    {
      icon: 'Shirt',
      title: 'Appearance',
      description: 'Professional attire recommended',
    },
    {
      icon: 'Zap',
      title: 'Background',
      description: 'Plain or professional background preferred',
    },
  ]

  const iconMap: Record<string, string> = {
    Dimensions: 'Maximize2',
    FileSize: 'HardDrive',
    Image: 'Image',
    Smile: 'Smile',
    Shirt: 'Shirt',
    Zap: 'Zap',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Requirements</CardTitle>
        <CardDescription>
          Follow these guidelines to ensure your photo meets our standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requirements.map((req) => (
            <div key={req.title} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                  <SafeIcon
                    name={iconMap[req.icon]}
                    size={20}
                    className="text-primary"
                  />
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">{req.title}</p>
                <p className="text-sm text-muted-foreground">{req.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            <strong>Why a good profile photo matters:</strong>
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex gap-2">
              <SafeIcon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Increases your chances of getting noticed by employers</span>
            </li>
            <li className="flex gap-2">
              <SafeIcon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Creates a professional first impression</span>
            </li>
            <li className="flex gap-2">
              <SafeIcon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span>Makes your profile more complete and trustworthy</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
