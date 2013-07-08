shinyUI(pageWithSidebar(
  
  # Application title
  headerPanel("Labrador - Get MAX response out of MiHPT logs"),
  
  sidebarPanel(
    fileInput('files', "Choose MiHPT data file (.mhp)", multiple=TRUE),
    
    tags$hr(),
    
    numericInput('toplines','Lines to skip at the top of each file',0,min=0),
    checkboxInput('header', 'Is there a Header row', TRUE),
    
    textInput('nas','How are null values coded?',"n/a"),
    radioButtons('sep', 'Field Separator',
                 c(Comma=',',
                   Semicolon=';',
                   Tab='\t'),
                 'Tab'),
    radioButtons('quote', 'Text Quote',
                 c(None='',
                   'Double Quote'='"',
                   'Single Quote'="'"),
                 'Double Quote'),
    
    tags$hr(),
    
    radioButtons('func', 'Which summary function would you like?',
                c(Max='max',Min='min',Average='mean',Sum='sum'),
                'Max')
    
  ),
  
  mainPanel(
    h3(textOutput("Showing content of first designated file")),
    tabsetPanel(
      tabPanel("Preview File", tableOutput('contents')),
      tabPanel("Combined Surfer format", 
               downloadButton('dlTransformedData', 'Download'),
               tableOutput('transformedContents'))
    )
  )
))

