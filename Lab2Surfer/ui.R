shinyUI(pageWithSidebar(
  
  # Application title
  headerPanel("Labrador - go fetch lab data"),
  
  sidebarPanel(
    fileInput('file1', "Choose Lab report file", multiple=FALSE, accept=c('text/csv', 'text/comma-separated-values', 'text/plain') ),

    numericInput('toplines','Lines to skip at the top of the file',1,min=0),
    checkboxInput('header', 'Header', TRUE),
    #numericInput('rownamz','Which column holds the row IDs?',1,min=0),
    textInput('nas','How are null values coded?',"ND"),
    radioButtons('sep', 'Field Separator',
                 c(Comma=',',
                   Semicolon=';',
                   Tab='\t'),
                 'Comma'),
    radioButtons('quote', 'Text Quote',
                 c(None='',
                   'Double Quote'='"',
                   'Single Quote'="'"),
                 'Double Quote')
    
  ),
  
  mainPanel(
    h3(textOutput("caption")),
    tabsetPanel(
      tabPanel("Original File", tableOutput('contents')),
      tabPanel("Surfer Format", 
               downloadButton('dlTransformedData', 'Download'),
               tableOutput('transformedContents'))
    )
  )
))

# runApp("/Users/jason/Documents/Azimuth1/Azimuth1/IR+D/labrador")