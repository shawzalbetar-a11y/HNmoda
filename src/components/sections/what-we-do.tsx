'use client';
import { useLanguage } from '@/context/language-context';
import { translations } from '@/lib/translations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Scissors, Shirt, Star } from 'lucide-react';

export function WhatWeDo() {
    const { language } = useLanguage();
    const t = translations[language].whatWeDo;

    const services = [
        {
            title: t.specialModels.title,
            description: t.specialModels.description,
            points: [
                t.specialModels.point1,
                t.specialModels.point2,
                t.specialModels.point3,
            ],
            icon: <Star className="w-8 h-8 text-primary" />
        },
        {
            title: t.ourCollections.title,
            description: t.ourCollections.description,
            points: [
                t.ourCollections.point1,
                t.ourCollections.point2,
                t.ourCollections.point3,
            ],
            icon: <Shirt className="w-8 h-8 text-primary" />
        },
        {
            title: t.byThePiece.title,
            description: t.byThePiece.description,
            points: [
                t.byThePiece.point1,
                t.byThePiece.point2,
                t.byThePiece.point3,
            ],
            icon: <Scissors className="w-8 h-8 text-primary" />
        }
    ];

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display">{t.title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    {service.icon}
                                    <CardTitle>{service.title}</CardTitle>
                                </div>
                                <CardDescription className="pt-2">{service.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {service.points.map((point, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-primary mr-2">🔹</span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
