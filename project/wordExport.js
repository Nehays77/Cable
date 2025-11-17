// Word Export functionality using docx.js

async function generateWord(calculationData) {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;
    
    const inputs = calculationData.inputs;
    const results = calculationData.results;
    
    const materialNames = {
        'copper': 'Copper',
        'aluminium': 'Aluminium',
        'lead': 'Lead',
        'steel': 'Steel',
        'bronze': 'Bronze'
    };
    
    // Create document
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Balfour Beatty Header
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Balfour Beatty",
                            bold: true,
                            size: 36, // 24pt equivalent
                            color: "0066CC" // Medium blue
                        })
                    ],
                    spacing: { after: 200 }
                }),
                
                // Blue line (simulated with border)
                new Paragraph({
                    children: [
                        new TextRun({
                            text: " ",
                            size: 1
                        })
                    ],
                    border: {
                        bottom: {
                            color: "ADD8E6", // Light blue
                            size: 6,
                            style: BorderStyle.SINGLE
                        }
                    },
                    spacing: { after: 400 }
                }),
                
                // Title
                new Paragraph({
                    text: "IEC 949 Conductor Calculator",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 }
                }),
                
                // Subtitle
                new Paragraph({
                    text: "Adiabatic Current Calculation Report",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                
                // Date
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                            size: 20
                        })
                    ],
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 400 }
                }),
                
                // Line separator
                new Paragraph({
                    text: " ",
                    border: {
                        bottom: {
                            color: "000000",
                            size: 4,
                            style: BorderStyle.SINGLE
                        }
                    },
                    spacing: { after: 400 }
                }),
                
                // Input Parameters Section
                new Paragraph({
                    text: "Input Parameters",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 }
                }),
                
                // Input Parameters Table
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Voltage", bold: true })],
                                    width: { size: 50, type: WidthType.PERCENTAGE }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${inputs.voltage.toFixed(1)} kV` })],
                                    width: { size: 50, type: WidthType.PERCENTAGE }
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Conductor Material", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: materialNames[inputs.material] || inputs.material })]
                                })
                            ]
                        }),
                        ...(inputs.conductorArea !== null && inputs.conductorArea !== undefined ? [new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Conductor Area", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${inputs.conductorArea.toFixed(2)} mm²` })]
                                })
                            ]
                        })] : []),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Short Circuit Current", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${inputs.shortCircuitCurrent.toFixed(2)} kA` })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Time", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${inputs.time.toFixed(2)} s` })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Initial Temperature", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${inputs.initialTemp.toFixed(1)} °C` })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Final Temperature", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${inputs.finalTemp.toFixed(1)} °C` })]
                                })
                            ]
                        })
                    ]
                }),
                
                new Paragraph({
                    text: " ",
                    spacing: { after: 400 }
                }),
                
                // Calculation Results Section
                new Paragraph({
                    text: "Calculation Results",
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 200 }
                }),
                
                // Results Table
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Voltage", bold: true })],
                                    width: { size: 50, type: WidthType.PERCENTAGE }
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${(results.voltage || inputs.voltage || 0).toFixed(1)} kV` })],
                                    width: { size: 50, type: WidthType.PERCENTAGE }
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Short Circuit Current", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${(results.shortCircuitCurrent / 1000).toFixed(2)} kA` })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Required Area", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${results.requiredArea.toFixed(2)} mm²` })]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: "Suggested Standard Size", bold: true })]
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${results.suggestedStandardSize.toFixed(0)} mm²` })]
                                })
                            ]
                        }),
                        ...(results.conductorArea !== null && results.conductorArea !== undefined ? [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "Adiabatic Current (I_AD)", bold: true })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: `${results.adiabaticCurrent.toFixed(2)} A` })]
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "Safety Factor", bold: true })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: `${results.safetyFactor.toFixed(2)}` })]
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "Selected Conductor Area", bold: true })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ text: `${results.conductorArea.toFixed(2)} mm²` })]
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ text: "Conductor Adequacy", bold: true })]
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ 
                                            text: results.isAdequate ? '✓ ADEQUATE' : '✗ INADEQUATE',
                                            bold: true,
                                            color: results.isAdequate ? "10B981" : "EF4444"
                                        })]
                                    })
                                ]
                            })
                        ] : [])
                    ]
                }),
                
                new Paragraph({
                    text: " ",
                    spacing: { after: 400 }
                }),
                
                // Footer
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "This report is generated based on IEC 949 standard calculations.",
                            italics: true,
                            size: 16
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 800 }
                })
            ]
        }]
    });
    
    // Generate and download
    try {
        const blob = await Packer.toBlob(doc);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `IEC949_Conductor_Calculation_${timestamp}.docx`;
        saveAs(blob, filename);
    } catch (error) {
        console.error('Error generating Word document:', error);
        alert('Error generating Word document. Please try again.');
    }
}

