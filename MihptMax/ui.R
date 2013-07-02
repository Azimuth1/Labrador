shinyUI(pageWithSidebar(
  
  # Application title
  headerPanel("Labrador - Max response on MIHPT log"),
  
  sidebarPanel(
    fileInput('files', "Choose MiHPT data file (.mhp)", multiple=TRUE),
    
    tags$hr(),
    
    numericInput('toplines','Lines to skip at the top of the file',0,min=0),
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